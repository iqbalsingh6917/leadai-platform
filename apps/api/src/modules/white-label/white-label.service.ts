import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhiteLabelConfig } from './entities/white-label-config.entity';
import { CreateWhiteLabelDto } from './dto/white-label.dto';

@Injectable()
export class WhiteLabelService {
  constructor(
    @InjectRepository(WhiteLabelConfig)
    private readonly repo: Repository<WhiteLabelConfig>,
  ) {}

  async getConfig(tenantId: string): Promise<WhiteLabelConfig> {
    const config = await this.repo.findOne({ where: { tenantId } });
    if (!config) {
      return {
        id: '',
        tenantId,
        customDomain: null,
        logoUrl: null,
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        companyName: null,
        favicon: null,
        emailFromName: null,
        emailFromAddress: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as WhiteLabelConfig;
    }
    return config;
  }

  async upsertConfig(tenantId: string, dto: CreateWhiteLabelDto): Promise<WhiteLabelConfig> {
    let config = await this.repo.findOne({ where: { tenantId } });
    if (config) {
      Object.assign(config, dto);
    } else {
      config = this.repo.create({ ...dto, tenantId });
    }
    return this.repo.save(config);
  }

  async getByDomain(domain: string): Promise<WhiteLabelConfig | null> {
    return this.repo.findOne({ where: { customDomain: domain } });
  }
}
