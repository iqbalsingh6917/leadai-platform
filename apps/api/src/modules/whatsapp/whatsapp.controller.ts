import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { WhatsAppService } from './whatsapp.service';
import { SaveConfigDto, SendMessageDto, SendTemplateDto } from './dto/whatsapp.dto';
import { MessageDirection } from './entities/whatsapp-message.entity';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('config')
  getConfig(@GetTenant() tenantId: string) {
    return this.whatsAppService.getConfig(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('config')
  saveConfig(@Body() dto: SaveConfigDto, @GetTenant() tenantId: string) {
    return this.whatsAppService.saveConfig(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('config/test')
  testConnection(@GetTenant() tenantId: string) {
    return this.whatsAppService.testConnection(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send')
  sendMessage(@Body() dto: SendMessageDto, @GetTenant() tenantId: string) {
    return this.whatsAppService.sendMessage(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-template')
  sendTemplate(@Body() dto: SendTemplateDto, @GetTenant() tenantId: string) {
    return this.whatsAppService.sendTemplate(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('messages')
  getMessages(
    @Query('leadId') leadId: string,
    @Query('direction') direction: MessageDirection,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetTenant() tenantId: string,
  ) {
    return this.whatsAppService.getMessages(tenantId, {
      leadId,
      direction,
      page: +page || 1,
      limit: +limit || 20,
    });
  }

  // Public — Meta webhook callback
  @Post('webhook/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('tenantId') tenantId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.whatsAppService.handleWebhook(tenantId, payload);
  }

  // Public — Meta hub.verify
  @Get('webhook/:tenantId')
  async verifyWebhook(
    @Param('tenantId') tenantId: string,
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const result = await this.whatsAppService.verifyWebhook(tenantId, mode, token, challenge);
    res.status(200).contentType('text/plain').send(result);
  }
}
