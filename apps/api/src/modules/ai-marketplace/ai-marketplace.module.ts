import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceAgent } from './entities/marketplace-agent.entity';
import { AgentInstallation } from './entities/agent-installation.entity';
import { AiMarketplaceController } from './ai-marketplace.controller';
import { AiMarketplaceService } from './ai-marketplace.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarketplaceAgent, AgentInstallation])],
  controllers: [AiMarketplaceController],
  providers: [AiMarketplaceService],
  exports: [AiMarketplaceService],
})
export class AiMarketplaceModule {}
