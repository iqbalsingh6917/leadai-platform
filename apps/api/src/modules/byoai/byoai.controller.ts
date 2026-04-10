import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { ByoaiService } from './byoai.service';
import { CreateAiModelConfigDto } from './dto/byoai.dto';

@ApiTags('byoai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('byoai')
export class ByoaiController {
  constructor(private readonly service: ByoaiService) {}

  @Get('config')
  getConfig(@GetTenant() tenantId: string) {
    return this.service.getConfig(tenantId);
  }

  @Put('config')
  upsertConfig(@Body() dto: CreateAiModelConfigDto, @GetTenant() tenantId: string) {
    return this.service.upsert(tenantId, dto);
  }

  @Post('test')
  testConnection(@Body() dto: CreateAiModelConfigDto) {
    return this.service.testConnection(dto);
  }
}
