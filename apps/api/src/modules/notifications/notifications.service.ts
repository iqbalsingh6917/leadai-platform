import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(params: {
    type: NotificationType;
    title: string;
    message: string;
    userId: string;
    tenantId: string;
    entityId?: string;
    entityType?: string;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create(params);
    return this.notificationRepository.save(notification);
  }

  async findByUser(
    userId: string,
    tenantId: string,
    onlyUnread = false,
  ): Promise<Notification[]> {
    const where: any = { userId, tenantId };
    if (onlyUnread) where.isRead = false;
    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string, tenantId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId, tenantId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllRead(userId: string, tenantId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, tenantId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string, tenantId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, tenantId, isRead: false },
    });
  }
}
