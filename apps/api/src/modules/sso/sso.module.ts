import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsoConfig } from './entities/sso-config.entity';
import { SsoSession } from './entities/sso-session.entity';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';

@Module({
  imports: [TypeOrmModule.forFeature([SsoConfig, SsoSession])],
  controllers: [SsoController],
  providers: [SsoService],
  exports: [SsoService],
})
export class SsoModule {}
