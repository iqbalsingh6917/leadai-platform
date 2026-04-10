import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async findAll(tenantId: string, filters: { type?: string; status?: string; page?: number; limit?: number }) {
    const { type, status, page = 1, limit = 20 } = filters;
    const where: any = { tenantId };
    if (type) where.type = type;
    if (status) where.status = status;

    const [data, total] = await this.campaignRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const campaign = await this.campaignRepository.findOne({ where: { id, tenantId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateCampaignDto, tenantId: string) {
    const campaign = this.campaignRepository.create({ ...dto, tenantId });
    return this.campaignRepository.save(campaign);
  }

  async update(id: string, dto: UpdateCampaignDto, tenantId: string) {
    const campaign = await this.findOne(id, tenantId);
    Object.assign(campaign, dto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: string, tenantId: string) {
    const campaign = await this.findOne(id, tenantId);
    await this.campaignRepository.remove(campaign);
  }
}
