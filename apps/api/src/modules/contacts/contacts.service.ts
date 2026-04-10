import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findAll(tenantId: string, filters: { search?: string; lifecycleStage?: string; page?: number; limit?: number }) {
    const { search, lifecycleStage, page = 1, limit = 20 } = filters;
    const where: any = { tenantId };
    if (lifecycleStage) where.lifecycleStage = lifecycleStage;

    const [data, total] = await this.contactRepository.findAndCount({
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
    const contact = await this.contactRepository.findOne({ where: { id, tenantId } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async create(dto: CreateContactDto, tenantId: string) {
    const contact = this.contactRepository.create({ ...dto, tenantId });
    return this.contactRepository.save(contact);
  }

  async update(id: string, dto: UpdateContactDto, tenantId: string) {
    const contact = await this.findOne(id, tenantId);
    Object.assign(contact, dto);
    return this.contactRepository.save(contact);
  }

  async remove(id: string, tenantId: string) {
    const contact = await this.findOne(id, tenantId);
    await this.contactRepository.remove(contact);
  }
}
