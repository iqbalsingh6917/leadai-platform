import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly templateRepository: Repository<EmailTemplate>,
  ) {}

  async findAll(tenantId: string, filters: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = filters;
    const where: any[] = search
      ? [
          { tenantId, name: ILike(`%${search}%`) },
          { tenantId, subject: ILike(`%${search}%`) },
        ]
      : [{ tenantId }];

    const [data, total] = await this.templateRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const template = await this.templateRepository.findOne({ where: { id, tenantId } });
    if (!template) throw new NotFoundException('Email template not found');
    return template;
  }

  async create(dto: CreateEmailTemplateDto, tenantId: string) {
    const template = this.templateRepository.create({ ...dto, tenantId });
    return this.templateRepository.save(template);
  }

  async update(id: string, dto: UpdateEmailTemplateDto, tenantId: string) {
    const template = await this.findOne(id, tenantId);
    Object.assign(template, dto);
    return this.templateRepository.save(template);
  }

  async remove(id: string, tenantId: string) {
    const template = await this.findOne(id, tenantId);
    await this.templateRepository.remove(template);
  }

  async preview(id: string, tenantId: string, variables: Record<string, string>) {
    const template = await this.findOne(id, tenantId);
    const replace = (str: string) =>
      str.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? `{{${key}}}`);
    return { subject: replace(template.subject), body: replace(template.body) };
  }
}
