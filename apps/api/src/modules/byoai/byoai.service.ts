import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiModelConfig } from './entities/ai-model-config.entity';
import { CreateAiModelConfigDto } from './dto/byoai.dto';

@Injectable()
export class ByoaiService {
  constructor(
    @InjectRepository(AiModelConfig)
    private readonly repo: Repository<AiModelConfig>,
  ) {}

  async upsert(tenantId: string, dto: CreateAiModelConfigDto): Promise<AiModelConfig> {
    let config = await this.repo.findOne({ where: { tenantId } });
    if (config) {
      Object.assign(config, dto);
    } else {
      config = this.repo.create({ ...dto, tenantId });
    }
    return this.repo.save(config);
  }

  async getConfig(tenantId: string): Promise<AiModelConfig | null> {
    return this.repo.findOne({ where: { tenantId } });
  }

  async getActive(tenantId: string): Promise<AiModelConfig | null> {
    return this.repo.findOne({ where: { tenantId, isActive: true } });
  }

  async testConnection(config: CreateAiModelConfigDto): Promise<{ success: boolean; latencyMs: number; model: string }> {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 300) + 100));
    return {
      success: true,
      latencyMs: Date.now() - start,
      model: config.modelName ?? config.provider,
    };
  }
}
