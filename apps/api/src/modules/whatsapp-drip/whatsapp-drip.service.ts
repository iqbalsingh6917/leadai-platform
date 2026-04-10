import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WhatsAppDripCampaign } from './entities/drip-campaign.entity';
import { WhatsAppDripStep } from './entities/drip-step.entity';
import {
  WhatsAppDripEnrollment,
  DripEnrollmentStatus,
} from './entities/drip-enrollment.entity';
import {
  CreateDripCampaignDto,
  UpdateDripCampaignDto,
  EnrollLeadsDripDto,
  DripStepDto,
} from './dto/drip.dto';

@Injectable()
export class WhatsAppDripService {
  constructor(
    @InjectRepository(WhatsAppDripCampaign)
    private readonly campaignRepository: Repository<WhatsAppDripCampaign>,
    @InjectRepository(WhatsAppDripStep)
    private readonly stepRepository: Repository<WhatsAppDripStep>,
    @InjectRepository(WhatsAppDripEnrollment)
    private readonly enrollmentRepository: Repository<WhatsAppDripEnrollment>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(tenantId: string, filters: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = filters;
    const [data, total] = await this.campaignRepository.findAndCount({
      where: { tenantId },
      relations: [],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string): Promise<WhatsAppDripCampaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id, tenantId } });
    if (!campaign) throw new NotFoundException('Drip campaign not found');
    return campaign;
  }

  async create(dto: CreateDripCampaignDto, tenantId: string): Promise<WhatsAppDripCampaign> {
    const campaign = this.campaignRepository.create({
      name: dto.name,
      description: dto.description,
      trigger: dto.trigger,
      status: dto.status,
      tenantId,
      steps: dto.steps.map((s: DripStepDto) =>
        this.stepRepository.create({
          stepOrder: s.stepOrder,
          delayDays: s.delayDays,
          messageType: s.messageType,
          body: s.body,
          templateParams: s.templateParams ? JSON.stringify(s.templateParams) : null,
        }),
      ),
    });
    return this.campaignRepository.save(campaign);
  }

  async update(
    id: string,
    dto: UpdateDripCampaignDto,
    tenantId: string,
  ): Promise<WhatsAppDripCampaign> {
    const campaign = await this.findOne(id, tenantId);

    if (dto.steps !== undefined) {
      await this.dataSource.transaction(async (manager) => {
        await manager.delete(WhatsAppDripStep, { campaign: { id } });
        campaign.steps = dto.steps!.map((s: DripStepDto) =>
          this.stepRepository.create({
            stepOrder: s.stepOrder,
            delayDays: s.delayDays,
            messageType: s.messageType,
            body: s.body,
            templateParams: s.templateParams ? JSON.stringify(s.templateParams) : null,
          }),
        );
        await manager.save(WhatsAppDripCampaign, campaign);
      });
      // Re-fetch with steps
      return this.findOne(id, tenantId);
    }

    Object.assign(campaign, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.trigger !== undefined && { trigger: dto.trigger }),
      ...(dto.status !== undefined && { status: dto.status }),
    });

    return this.campaignRepository.save(campaign);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const campaign = await this.findOne(id, tenantId);
    await this.campaignRepository.remove(campaign);
  }

  async enroll(
    campaignId: string,
    dto: EnrollLeadsDripDto,
    tenantId: string,
  ): Promise<{ enrolled: number }> {
    await this.findOne(campaignId, tenantId);
    let enrolled = 0;

    const count = Math.min(dto.leadIds.length, dto.phoneNumbers.length);
    for (let i = 0; i < count; i++) {
      const leadId = dto.leadIds[i];
      const phoneNumber = dto.phoneNumbers[i];

      const existing = await this.enrollmentRepository.findOne({
        where: { campaignId, leadId, status: DripEnrollmentStatus.ACTIVE, tenantId },
      });
      if (existing) continue;

      const enrollment = this.enrollmentRepository.create({
        campaignId,
        leadId,
        phoneNumber,
        currentStep: 0,
        status: DripEnrollmentStatus.ACTIVE,
        nextRunAt: new Date(),
        tenantId,
      });
      await this.enrollmentRepository.save(enrollment);
      enrolled++;
    }

    return { enrolled };
  }

  async getEnrollments(campaignId: string, tenantId: string): Promise<WhatsAppDripEnrollment[]> {
    await this.findOne(campaignId, tenantId);
    return this.enrollmentRepository.find({
      where: { campaignId, tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async cancelEnrollment(enrollmentId: string, tenantId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId, tenantId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    enrollment.status = DripEnrollmentStatus.CANCELLED;
    await this.enrollmentRepository.save(enrollment);
  }
}
