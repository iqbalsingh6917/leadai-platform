import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppDripController } from './whatsapp-drip.controller';
import { WhatsAppDripService } from './whatsapp-drip.service';
import { WhatsAppDripCampaign } from './entities/drip-campaign.entity';
import { WhatsAppDripStep } from './entities/drip-step.entity';
import { WhatsAppDripEnrollment } from './entities/drip-enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhatsAppDripCampaign, WhatsAppDripStep, WhatsAppDripEnrollment]),
  ],
  controllers: [WhatsAppDripController],
  providers: [WhatsAppDripService],
  exports: [WhatsAppDripService],
})
export class WhatsAppDripModule {}
