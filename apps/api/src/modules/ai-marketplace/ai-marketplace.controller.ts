import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { AiMarketplaceService } from './ai-marketplace.service';
import { PublishAgentDto, InstallAgentDto } from './dto/marketplace.dto';

@ApiTags('ai-marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-marketplace')
export class AiMarketplaceController {
  constructor(private readonly service: AiMarketplaceService) {}

  @Get('agents')
  listAgents(
    @Query('category') category?: string,
    @Query('price') price?: string,
    @Query('search') search?: string,
  ) {
    return this.service.listAgents(category, price, search);
  }

  @Get('agents/:id')
  getAgent(@Param('id') id: string) {
    return this.service.getAgent(id);
  }

  @Post('agents/:id/install')
  installAgent(@Param('id') id: string, @Body() dto: InstallAgentDto, @GetTenant() tenantId: string) {
    return this.service.installAgent(tenantId, id, dto);
  }

  @Delete('agents/:id/uninstall')
  uninstallAgent(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.uninstallAgent(tenantId, id);
  }

  @Get('installed')
  getInstalled(@GetTenant() tenantId: string) {
    return this.service.getInstalledAgents(tenantId);
  }

  @Post('publish')
  publishAgent(@Body() dto: PublishAgentDto, @GetTenant() tenantId: string) {
    return this.service.publishAgent(tenantId, dto);
  }
}
