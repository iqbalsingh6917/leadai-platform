import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelinesController, DealsController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { Pipeline } from './entities/pipeline.entity';
import { PipelineStage } from './entities/pipeline-stage.entity';
import { Deal } from './entities/deal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pipeline, PipelineStage, Deal])],
  controllers: [PipelinesController, DealsController],
  providers: [PipelinesService],
  exports: [PipelinesService],
})
export class PipelinesModule {}
