import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline } from './entities/pipeline.entity';
import { PipelineStage } from './entities/pipeline-stage.entity';
import { Deal } from './entities/deal.entity';
import {
  CreatePipelineDto,
  UpdatePipelineDto,
  CreateDealDto,
  UpdateDealDto,
  MoveDealDto,
} from './dto/pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectRepository(Pipeline)
    private readonly pipelineRepository: Repository<Pipeline>,
    @InjectRepository(PipelineStage)
    private readonly stageRepository: Repository<PipelineStage>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
  ) {}

  async findAll(tenantId: string) {
    return this.pipelineRepository.find({
      where: { tenantId },
      relations: ['stages', 'stages.deals'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const pipeline = await this.pipelineRepository.findOne({
      where: { id, tenantId },
      relations: ['stages', 'stages.deals'],
    });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    return pipeline;
  }

  async create(dto: CreatePipelineDto, tenantId: string) {
    const pipeline = this.pipelineRepository.create({ name: dto.name, tenantId });
    const saved = await this.pipelineRepository.save(pipeline);

    if (dto.stages && dto.stages.length > 0) {
      const stages = dto.stages.map((s) =>
        this.stageRepository.create({ name: s.name, order: s.order, pipelineId: saved.id }),
      );
      await this.stageRepository.save(stages);
    }

    return this.findOne(saved.id, tenantId);
  }

  async update(id: string, dto: UpdatePipelineDto, tenantId: string) {
    const pipeline = await this.findOne(id, tenantId);
    Object.assign(pipeline, dto);
    return this.pipelineRepository.save(pipeline);
  }

  async remove(id: string, tenantId: string) {
    const pipeline = await this.findOne(id, tenantId);
    await this.pipelineRepository.remove(pipeline);
  }

  async createDeal(dto: CreateDealDto, tenantId: string) {
    const stage = await this.stageRepository.findOne({ where: { id: dto.stageId } });
    if (!stage) throw new NotFoundException('Stage not found');
    const deal = this.dealRepository.create({ ...dto, tenantId });
    return this.dealRepository.save(deal);
  }

  async updateDeal(id: string, dto: UpdateDealDto, tenantId: string) {
    const deal = await this.dealRepository.findOne({ where: { id, tenantId } });
    if (!deal) throw new NotFoundException('Deal not found');
    Object.assign(deal, dto);
    return this.dealRepository.save(deal);
  }

  async deleteDeal(id: string, tenantId: string) {
    const deal = await this.dealRepository.findOne({ where: { id, tenantId } });
    if (!deal) throw new NotFoundException('Deal not found');
    await this.dealRepository.remove(deal);
  }

  async moveDeal(id: string, dto: MoveDealDto, tenantId: string) {
    const deal = await this.dealRepository.findOne({ where: { id, tenantId } });
    if (!deal) throw new NotFoundException('Deal not found');
    const stage = await this.stageRepository.findOne({ where: { id: dto.stageId } });
    if (!stage) throw new NotFoundException('Stage not found');
    deal.stageId = dto.stageId;
    return this.dealRepository.save(deal);
  }
}
