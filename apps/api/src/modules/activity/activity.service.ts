import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction, ActivityEntityType } from './entities/activity-log.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async log(params: {
    entityType: ActivityEntityType;
    entityId: string;
    action: ActivityAction;
    tenantId: string;
    performedBy?: string;
    performedByName?: string;
    metadata?: Record<string, any>;
    description?: string;
  }): Promise<ActivityLog> {
    const entry = this.activityLogRepository.create(params);
    return this.activityLogRepository.save(entry);
  }

  async findByEntity(
    entityType: ActivityEntityType,
    entityId: string,
    tenantId: string,
  ): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { entityType, entityId, tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTenant(
    tenantId: string,
    page = 1,
    limit = 50,
  ): Promise<{ data: ActivityLog[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.activityLogRepository.findAndCount({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }
}
