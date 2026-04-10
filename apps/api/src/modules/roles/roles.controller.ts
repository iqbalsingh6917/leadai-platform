import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get('permissions')
  getPermissions() {
    return this.service.getPermissions();
  }

  @Post()
  create(@Body() dto: CreateRoleDto, @GetTenant() tenantId: string) {
    return this.service.create(tenantId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto, @GetTenant() tenantId: string) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.delete(tenantId, id);
  }
}
