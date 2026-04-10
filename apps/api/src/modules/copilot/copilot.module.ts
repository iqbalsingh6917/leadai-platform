import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CopilotController } from './copilot.controller';
import { CopilotService } from './copilot.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CopilotController],
  providers: [CopilotService],
})
export class CopilotModule {}
