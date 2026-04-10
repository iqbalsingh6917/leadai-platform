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
import { PipelinesService } from './pipelines.service';
import {
  CreatePipelineDto,
  UpdatePipelineDto,
  CreateDealDto,
  UpdateDealDto,
  MoveDealDto,
} from './dto/pipeline.dto';

@ApiTags('pipelines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.pipelinesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.pipelinesService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreatePipelineDto, @GetTenant() tenantId: string) {
    return this.pipelinesService.create(dto, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePipelineDto, @GetTenant() tenantId: string) {
    return this.pipelinesService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.pipelinesService.remove(id, tenantId);
  }
}

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post()
  create(@Body() dto: CreateDealDto, @GetTenant() tenantId: string) {
    return this.pipelinesService.createDeal(dto, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDealDto, @GetTenant() tenantId: string) {
    return this.pipelinesService.updateDeal(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.pipelinesService.deleteDeal(id, tenantId);
  }

  @Patch(':id/move')
  move(@Param('id') id: string, @Body() dto: MoveDealDto, @GetTenant() tenantId: string) {
    return this.pipelinesService.moveDeal(id, dto, tenantId);
  }
}
