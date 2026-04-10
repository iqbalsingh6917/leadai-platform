import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration, IntegrationStatus } from './entities/integration.entity';
import { ConnectIntegrationDto } from './dto/integration.dto';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integration)
    private readonly repo: Repository<Integration>,
  ) {}

  async findAll(tenantId: string): Promise<Integration[]> {
    return this.repo.find({ where: { tenantId } });
  }

  async connect(tenantId: string, provider: string, dto: ConnectIntegrationDto): Promise<Integration> {
    let integration = await this.repo.findOne({ where: { tenantId, provider } });
    if (integration) {
      integration.status = IntegrationStatus.CONNECTED;
      if (dto.config) integration.config = dto.config;
    } else {
      integration = this.repo.create({
        tenantId,
        provider,
        category: provider,
        status: IntegrationStatus.CONNECTED,
        config: dto.config,
      });
    }
    return this.repo.save(integration);
  }

  async disconnect(tenantId: string, provider: string): Promise<Integration> {
    const integration = await this.repo.findOne({ where: { tenantId, provider } });
    if (!integration) throw new NotFoundException('Integration not found');
    integration.status = IntegrationStatus.DISCONNECTED;
    return this.repo.save(integration);
  }

  async sync(tenantId: string, provider: string): Promise<Integration> {
    const integration = await this.repo.findOne({ where: { tenantId, provider } });
    if (!integration) throw new NotFoundException('Integration not found');
    integration.lastSyncAt = new Date();
    return this.repo.save(integration);
  }
}
