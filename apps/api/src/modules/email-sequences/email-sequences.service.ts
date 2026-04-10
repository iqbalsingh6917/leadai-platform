import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailSequence } from './entities/sequence.entity';
import { EmailSequenceStep } from './entities/sequence-step.entity';
import { SequenceEnrollment, EnrollmentStatus } from './entities/sequence-enrollment.entity';
import { CreateSequenceDto, UpdateSequenceDto, EnrollLeadsDto } from './dto/sequence.dto';

@Injectable()
export class EmailSequencesService {
  constructor(
    @InjectRepository(EmailSequence)
    private readonly sequenceRepository: Repository<EmailSequence>,
    @InjectRepository(EmailSequenceStep)
    private readonly stepRepository: Repository<EmailSequenceStep>,
    @InjectRepository(SequenceEnrollment)
    private readonly enrollmentRepository: Repository<SequenceEnrollment>,
  ) {}

  async findAll(tenantId: string, filters: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = filters;
    const [data, total] = await this.sequenceRepository.findAndCount({
      where: { tenantId },
      relations: [],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const sequence = await this.sequenceRepository.findOne({ where: { id, tenantId } });
    if (!sequence) throw new NotFoundException('Email sequence not found');
    return sequence;
  }

  async create(dto: CreateSequenceDto, tenantId: string) {
    const sequence = this.sequenceRepository.create({
      name: dto.name,
      description: dto.description,
      trigger: dto.trigger,
      status: dto.status,
      tenantId,
      steps: dto.steps.map((s) => this.stepRepository.create(s)),
    });
    return this.sequenceRepository.save(sequence);
  }

  async update(id: string, dto: UpdateSequenceDto, tenantId: string) {
    const sequence = await this.findOne(id, tenantId);

    if (dto.steps !== undefined) {
      await this.stepRepository.delete({ sequence: { id } });
      sequence.steps = dto.steps.map((s) => this.stepRepository.create(s));
    }

    Object.assign(sequence, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.trigger !== undefined && { trigger: dto.trigger }),
      ...(dto.status !== undefined && { status: dto.status }),
    });

    return this.sequenceRepository.save(sequence);
  }

  async remove(id: string, tenantId: string) {
    const sequence = await this.findOne(id, tenantId);
    await this.sequenceRepository.remove(sequence);
  }

  async enroll(sequenceId: string, dto: EnrollLeadsDto, tenantId: string) {
    await this.findOne(sequenceId, tenantId);
    const enrollments: SequenceEnrollment[] = [];

    for (const leadId of dto.leadIds) {
      const existing = await this.enrollmentRepository.findOne({
        where: { sequenceId, leadId, status: EnrollmentStatus.ACTIVE, tenantId },
      });
      if (existing) continue;

      const enrollment = this.enrollmentRepository.create({
        sequenceId,
        leadId,
        currentStep: 0,
        status: EnrollmentStatus.ACTIVE,
        nextRunAt: new Date(),
        tenantId,
      });
      enrollments.push(await this.enrollmentRepository.save(enrollment));
    }

    return { enrolled: enrollments.length };
  }

  async getEnrollments(sequenceId: string, tenantId: string) {
    await this.findOne(sequenceId, tenantId);
    return this.enrollmentRepository.find({
      where: { sequenceId, tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async cancelEnrollment(enrollmentId: string, tenantId: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId, tenantId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    enrollment.status = EnrollmentStatus.CANCELLED;
    await this.enrollmentRepository.save(enrollment);
  }
}
