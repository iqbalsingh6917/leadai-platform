import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhiteLabelConfig } from './entities/white-label-config.entity';
import { WhiteLabelController } from './white-label.controller';
import { WhiteLabelService } from './white-label.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhiteLabelConfig])],
  controllers: [WhiteLabelController],
  providers: [WhiteLabelService],
  exports: [WhiteLabelService],
})
export class WhiteLabelModule {}
