import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CreateAutopilotRuleDto, UpdateAutopilotRuleDto } from './dto/autopilot.dto';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll(
    @Query('type') type: string,
    @Query('status') status: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetTenant() tenantId: string,
  ) {
    return this.campaignsService.findAll(tenantId, { type, status, page: +page || 1, limit: +limit || 20 });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.campaignsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreateCampaignDto, @GetTenant() tenantId: string) {
    return this.campaignsService.create(dto, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto, @GetTenant() tenantId: string) {
    return this.campaignsService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.campaignsService.remove(id, tenantId);
  }

  @Post('ai-optimize')
  aiOptimize(
    @Body() body: { campaigns: { id: string; name: string; spend: number; leads: number; conversions: number }[] },
    @GetTenant() tenantId: string,
  ) {
    return this.campaignsService.aiOptimize(body.campaigns, tenantId);
  }

  @Get('autopilot/rules')
  listRules(@GetTenant() tenantId: string) {
    return this.campaignsService.listRules(tenantId);
  }

  @Post('autopilot/rules')
  createRule(@Body() dto: CreateAutopilotRuleDto, @GetTenant() tenantId: string) {
    return this.campaignsService.createRule(tenantId, dto);
  }

  @Patch('autopilot/rules/:id')
  updateRule(@Param('id') id: string, @Body() dto: UpdateAutopilotRuleDto, @GetTenant() tenantId: string) {
    return this.campaignsService.updateRule(tenantId, id, dto);
  }

  @Delete('autopilot/rules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRule(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.campaignsService.deleteRule(tenantId, id);
  }

  @Patch('autopilot/rules/:id/toggle')
  toggleRule(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.campaignsService.toggleRule(tenantId, id);
  }
}
