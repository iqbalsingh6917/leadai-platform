import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFilterDto } from './dto/lead-filter.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async findAll(tenantId: string, filters: LeadFilterDto) {
    const { status, source, search, page = 1, limit = 20 } = filters;
    const where: any = { tenantId };

    if (status) where.status = status;
    if (source) where.source = source;

    const [data, total] = await this.leadRepository.findAndCount({
      where: search
        ? [
            { ...where, firstName: Like(`%${search}%`) },
            { ...where, lastName: Like(`%${search}%`) },
            { ...where, email: Like(`%${search}%`) },
            { ...where, company: Like(`%${search}%`) },
          ]
        : where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const lead = await this.leadRepository.findOne({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(dto: CreateLeadDto, tenantId: string) {
    const lead = this.leadRepository.create({ ...dto, tenantId });
    return this.leadRepository.save(lead);
  }

  async update(id: string, dto: UpdateLeadDto, tenantId: string) {
    const lead = await this.findOne(id, tenantId);
    Object.assign(lead, dto);
    return this.leadRepository.save(lead);
  }

  async remove(id: string, tenantId: string) {
    const lead = await this.findOne(id, tenantId);
    await this.leadRepository.remove(lead);
  }
}
