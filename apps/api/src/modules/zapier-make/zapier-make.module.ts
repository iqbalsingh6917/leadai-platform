import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ZapSubscription } from './entities/zap-subscription.entity';
import { ZapierMakeController } from './zapier-make.controller';
import { ZapierMakeService } from './zapier-make.service';

@Module({
  imports: [TypeOrmModule.forFeature([ZapSubscription]), HttpModule],
  controllers: [ZapierMakeController],
  providers: [ZapierMakeService],
  exports: [ZapierMakeService],
})
export class ZapierMakeModule {}
