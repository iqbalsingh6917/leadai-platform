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
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';

@ApiTags('workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.workflowsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.workflowsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreateWorkflowDto, @GetTenant() tenantId: string) {
    return this.workflowsService.create(dto, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDto,
    @GetTenant() tenantId: string,
  ) {
    return this.workflowsService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.workflowsService.remove(id, tenantId);
  }

  @Post(':id/trigger')
  trigger(
    @Param('id') id: string,
    @Body() inputData: Record<string, any>,
    @GetTenant() tenantId: string,
  ) {
    return this.workflowsService.triggerWorkflow(id, inputData, tenantId);
  }

  @Get(':id/runs')
  getRuns(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.workflowsService.getWorkflowRuns(id, tenantId);
  }
}
