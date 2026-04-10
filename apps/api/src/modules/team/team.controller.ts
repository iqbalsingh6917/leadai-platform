import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { TeamService } from './team.service';
import { InviteTeamMemberDto, UpdateTeamMemberDto } from './dto/team.dto';

@ApiTags('team')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.teamService.findAll(tenantId);
  }

  @Post('invite')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  invite(@Body() dto: InviteTeamMemberDto, @GetTenant() tenantId: string) {
    return this.teamService.invite(dto, tenantId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamMemberDto,
    @GetTenant() tenantId: string,
  ) {
    return this.teamService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.teamService.remove(id, tenantId);
  }
}
