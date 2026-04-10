import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoTemplate } from './entities/video-template.entity';
import { VideoJob } from './entities/video-job.entity';
import { VideoAiController } from './video-ai.controller';
import { VideoAiService } from './video-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoTemplate, VideoJob])],
  controllers: [VideoAiController],
  providers: [VideoAiService],
  exports: [VideoAiService],
})
export class VideoAiModule {}
