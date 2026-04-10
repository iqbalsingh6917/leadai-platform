import {
  Controller, Get, Post, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { KnowledgeGraphService } from './knowledge-graph.service';
import {
  CreateNodeDto,
  CreateRelationshipDto,
  IndustryInsightQueryDto,
  SimilarLeadsQueryDto,
  AnonymizedInsightDto,
} from './dto/knowledge-graph.dto';

@ApiTags('knowledge-graph')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('knowledge-graph')
export class KnowledgeGraphController {
  constructor(private readonly service: KnowledgeGraphService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get graph statistics for tenant' })
  getStats(@GetTenant() tenantId: string) {
    return this.service.getGraphStats(tenantId);
  }

  @Post('nodes')
  @ApiOperation({ summary: 'Create a graph node' })
  createNode(@GetTenant() tenantId: string, @Body() dto: CreateNodeDto) {
    return this.service.createNode(tenantId, dto);
  }

  @Post('relationships')
  @ApiOperation({ summary: 'Create a relationship between two nodes' })
  createRelationship(@GetTenant() tenantId: string, @Body() dto: CreateRelationshipDto) {
    return this.service.createRelationship(tenantId, dto);
  }

  @Get('similar-leads')
  @ApiOperation({ summary: 'Find leads similar to a given lead via graph traversal' })
  findSimilarLeads(@GetTenant() tenantId: string, @Query() query: SimilarLeadsQueryDto) {
    return this.service.findSimilarLeads(tenantId, query);
  }

  @Get('industry-insights')
  @ApiOperation({ summary: 'Get industry-level conversion and lead insights' })
  getIndustryInsights(@GetTenant() tenantId: string, @Query() query: IndustryInsightQueryDto) {
    return this.service.getIndustryInsights(tenantId, query);
  }

  @Post('cross-industry-insights')
  @ApiOperation({ summary: 'Cross-tenant anonymized insights (no PII)' })
  getCrossIndustryInsights(@Body() dto: AnonymizedInsightDto) {
    return this.service.getCrossIndustryInsights(dto);
  }

  @Delete('leads/:leadId')
  @ApiOperation({ summary: 'Remove lead nodes from the graph (GDPR/CCPA erasure)' })
  deleteLeadNodes(@GetTenant() tenantId: string, @Param('leadId') leadId: string) {
    return this.service.deleteLeadNodes(tenantId, leadId);
  }
}
