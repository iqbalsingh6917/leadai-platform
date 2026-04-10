import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';
import {
  CreateNodeDto,
  CreateRelationshipDto,
  IndustryInsightQueryDto,
  SimilarLeadsQueryDto,
  AnonymizedInsightDto,
  NodeType,
} from './dto/knowledge-graph.dto';

@Injectable()
export class KnowledgeGraphService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KnowledgeGraphService.name);
  private driver: Driver;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('NEO4J_URI', 'bolt://localhost:7687');
    const user = this.configService.get<string>('NEO4J_USER', 'neo4j');
    const password = this.configService.get<string>('NEO4J_PASSWORD', 'neo4j');

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    try {
      await this.driver.verifyConnectivity();
      this.logger.log('Connected to Neo4j');
      await this.createIndexes();
    } catch (err) {
      this.logger.warn(`Neo4j not available: ${err.message}. Graph features will be degraded.`);
    }
  }

  async onModuleDestroy() {
    if (this.driver) {
      await this.driver.close();
    }
  }

  private getSession(database?: string): Session {
    return this.driver.session({ database: database ?? 'neo4j' });
  }

  private async createIndexes() {
    const session = this.getSession();
    try {
      await session.run(`CREATE INDEX lead_tenant IF NOT EXISTS FOR (n:Lead) ON (n.tenantId)`);
      await session.run(`CREATE INDEX company_tenant IF NOT EXISTS FOR (n:Company) ON (n.tenantId)`);
      await session.run(`CREATE INDEX industry_name IF NOT EXISTS FOR (n:Industry) ON (n.name)`);
    } finally {
      await session.close();
    }
  }

  async createNode(tenantId: string, dto: CreateNodeDto): Promise<Record<string, any>> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `CREATE (n:${dto.type} {id: randomUUID(), label: $label, tenantId: $tenantId, createdAt: datetime(), properties: $props})
         RETURN n`,
        { label: dto.label, tenantId, props: dto.properties ?? {} },
      );
      return result.records[0].get('n').properties;
    } finally {
      await session.close();
    }
  }

  async createRelationship(tenantId: string, dto: CreateRelationshipDto): Promise<Record<string, any>> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (a {id: $fromId, tenantId: $tenantId}), (b {id: $toId, tenantId: $tenantId})
         CREATE (a)-[r:${dto.type} {createdAt: datetime(), properties: $props}]->(b)
         RETURN type(r) AS type, r.createdAt AS createdAt`,
        { fromId: dto.fromNodeId, toId: dto.toNodeId, tenantId, props: dto.properties ?? {} },
      );
      return result.records[0]?.toObject() ?? {};
    } finally {
      await session.close();
    }
  }

  async indexLead(tenantId: string, lead: {
    id: string; firstName: string; lastName: string;
    company?: string; source: string; tags: string[]; industry?: string;
  }): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `MERGE (l:Lead {id: $id, tenantId: $tenantId})
         SET l.name = $name, l.source = $source, l.tags = $tags, l.updatedAt = datetime()
         WITH l
         FOREACH (tag IN $tags |
           MERGE (t:Tag {name: tag})
           MERGE (l)-[:HAS_TAG]->(t)
         )`,
        {
          id: lead.id,
          tenantId,
          name: `${lead.firstName} ${lead.lastName}`,
          source: lead.source,
          tags: lead.tags,
        },
      );

      if (lead.company) {
        await session.run(
          `MATCH (l:Lead {id: $leadId, tenantId: $tenantId})
           MERGE (c:Company {name: $company, tenantId: $tenantId})
           MERGE (l)-[:WORKS_AT]->(c)`,
          { leadId: lead.id, tenantId, company: lead.company },
        );
      }

      if (lead.industry) {
        await session.run(
          `MATCH (l:Lead {id: $leadId, tenantId: $tenantId})
           MERGE (i:Industry {name: $industry})
           MERGE (l)-[:BELONGS_TO]->(i)`,
          { leadId: lead.id, tenantId, industry: lead.industry },
        );
      }
    } finally {
      await session.close();
    }
  }

  async findSimilarLeads(tenantId: string, query: SimilarLeadsQueryDto): Promise<any[]> {
    const session = this.getSession();
    const depth = query.depth ?? 2;
    const limit = query.limit ?? 10;
    try {
      const result = await session.run(
        `MATCH (l:Lead {id: $leadId, tenantId: $tenantId})-[*1..${depth}]-(similar:Lead)
         WHERE similar.id <> $leadId AND similar.tenantId = $tenantId
         RETURN DISTINCT similar.id AS id, similar.name AS name, count(*) AS connections
         ORDER BY connections DESC
         LIMIT $limit`,
        { leadId: query.leadId, tenantId, limit: neo4j.int(limit) },
      );
      return result.records.map((r) => r.toObject());
    } finally {
      await session.close();
    }
  }

  async getIndustryInsights(tenantId: string, query: IndustryInsightQueryDto): Promise<any[]> {
    const session = this.getSession();
    const limit = query.limit ?? 20;
    try {
      let cypher: string;
      const params: Record<string, any> = { tenantId, limit: neo4j.int(limit) };

      if (query.industry) {
        cypher = `
          MATCH (i:Industry {name: $industry})<-[:BELONGS_TO]-(l:Lead {tenantId: $tenantId})
          OPTIONAL MATCH (l)-[:HAS_TAG]->(t:Tag)
          RETURN i.name AS industry, l.source AS source, collect(DISTINCT t.name) AS tags,
                 count(l) AS leadCount
          ORDER BY leadCount DESC
          LIMIT $limit`;
        params.industry = query.industry;
      } else {
        cypher = `
          MATCH (i:Industry)<-[:BELONGS_TO]-(l:Lead {tenantId: $tenantId})
          RETURN i.name AS industry, count(l) AS leadCount
          ORDER BY leadCount DESC
          LIMIT $limit`;
      }

      const result = await session.run(cypher, params);
      return result.records.map((r) => r.toObject());
    } finally {
      await session.close();
    }
  }

  async getCrossIndustryInsights(query: AnonymizedInsightDto): Promise<any[]> {
    // Cross-tenant anonymized insights — no tenant filter, no PII returned
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (i:Industry {name: $industry})<-[:BELONGS_TO]-(l:Lead)
         OPTIONAL MATCH (l)-[:HAS_TAG]->(t:Tag)
         WHERE t.name IN $tags OR $tags = []
         RETURN i.name AS industry, l.source AS source,
                collect(DISTINCT t.name) AS commonTags,
                count(l) AS totalLeads,
                avg(coalesce(l.score, 0)) AS avgScore
         ORDER BY totalLeads DESC
         LIMIT 50`,
        { industry: query.industry, tags: query.tags ?? [] },
      );
      return result.records.map((r) => r.toObject());
    } finally {
      await session.close();
    }
  }

  async getGraphStats(tenantId: string): Promise<Record<string, any>> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (n {tenantId: $tenantId})
         RETURN labels(n)[0] AS type, count(n) AS count
         ORDER BY count DESC`,
        { tenantId },
      );

      const stats: Record<string, number> = {};
      result.records.forEach((r) => {
        stats[r.get('type')] = r.get('count').toNumber();
      });

      return { nodeStats: stats, tenantId };
    } finally {
      await session.close();
    }
  }

  async deleteLeadNodes(tenantId: string, leadId: string): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `MATCH (l:Lead {id: $leadId, tenantId: $tenantId})
         DETACH DELETE l`,
        { leadId, tenantId },
      );
    } finally {
      await session.close();
    }
  }
}
