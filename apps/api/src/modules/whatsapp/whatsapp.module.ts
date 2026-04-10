import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppConfig } from './entities/whatsapp-config.entity';
import { WhatsAppMessage } from './entities/whatsapp-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsAppConfig, WhatsAppMessage]), HttpModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
