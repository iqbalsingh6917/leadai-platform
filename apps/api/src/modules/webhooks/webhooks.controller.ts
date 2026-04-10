import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { WebhooksService } from './webhooks.service';
import { FacebookLeadDto, GoogleLeadDto } from './dto/webhook.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('facebook/:tenantId')
  @HttpCode(HttpStatus.OK)
  processFacebook(
    @Body() payload: FacebookLeadDto,
    @Param('tenantId') tenantId: string,
  ) {
    return this.webhooksService.processFacebookLead(payload, tenantId);
  }

  @Post('google/:tenantId')
  @HttpCode(HttpStatus.OK)
  processGoogle(
    @Body() payload: GoogleLeadDto,
    @Param('tenantId') tenantId: string,
  ) {
    return this.webhooksService.processGoogleLead(payload, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @GetTenant() tenantId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.webhooksService.findAll(
      tenantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
