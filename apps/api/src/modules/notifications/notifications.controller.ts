import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { GetUser } from '../../common/decorators/user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @GetUser() user: { id: string; tenantId: string },
    @GetTenant() tenantId: string,
    @Query('unread') unread?: string,
  ) {
    return this.notificationsService.findByUser(
      user.id,
      tenantId,
      unread === 'true',
    );
  }

  @Get('unread-count')
  async getUnreadCount(
    @GetUser() user: { id: string; tenantId: string },
    @GetTenant() tenantId: string,
  ) {
    const count = await this.notificationsService.getUnreadCount(user.id, tenantId);
    return { count };
  }

  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
    @GetUser() user: { id: string; tenantId: string },
    @GetTenant() tenantId: string,
  ) {
    return this.notificationsService.markRead(id, user.id, tenantId);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllRead(
    @GetUser() user: { id: string; tenantId: string },
    @GetTenant() tenantId: string,
  ) {
    await this.notificationsService.markAllRead(user.id, tenantId);
  }
}
