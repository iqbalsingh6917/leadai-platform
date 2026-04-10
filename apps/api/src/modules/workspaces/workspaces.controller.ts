import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';

@ApiTags('workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Post()
  create(@Body() dto: CreateWorkspaceDto, @GetTenant() tenantId: string) {
    return this.service.create(tenantId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto, @GetTenant() tenantId: string) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.delete(tenantId, id);
  }

  @Post(':id/suspend')
  suspend(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.suspend(tenantId, id);
  }

  @Post(':id/switch')
  switch(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.switch(tenantId, id);
  }
}
