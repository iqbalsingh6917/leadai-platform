import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModelConfig } from './entities/ai-model-config.entity';
import { ByoaiController } from './byoai.controller';
import { ByoaiService } from './byoai.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiModelConfig])],
  controllers: [ByoaiController],
  providers: [ByoaiService],
  exports: [ByoaiService],
})
export class ByoaiModule {}
