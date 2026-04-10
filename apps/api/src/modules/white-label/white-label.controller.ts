import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { WhiteLabelService } from './white-label.service';
import { UpdateWhiteLabelDto } from './dto/white-label.dto';

@ApiTags('white-label')
@Controller('white-label')
export class WhiteLabelController {
  constructor(private readonly service: WhiteLabelService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getConfig(@GetTenant() tenantId: string) {
    return this.service.getConfig(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  upsertConfig(@GetTenant() tenantId: string, @Body() dto: UpdateWhiteLabelDto) {
    return this.service.upsertConfig(tenantId, dto);
  }

  @Get('domain/:domain')
  getByDomain(@Param('domain') domain: string) {
    return this.service.getByDomain(domain);
  }
}
