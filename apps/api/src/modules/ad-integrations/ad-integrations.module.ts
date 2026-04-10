import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AdCampaign } from './entities/ad-campaign.entity';
import { AdIntegrationsController } from './ad-integrations.controller';
import { AdIntegrationsService } from './ad-integrations.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdCampaign]), HttpModule, ConfigModule],
  controllers: [AdIntegrationsController],
  providers: [AdIntegrationsService],
  exports: [AdIntegrationsService],
})
export class AdIntegrationsModule {}
