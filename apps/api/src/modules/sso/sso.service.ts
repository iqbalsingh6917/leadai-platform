import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SsoConfig } from './entities/sso-config.entity';
import { SsoSession } from './entities/sso-session.entity';
import { ConfigureSsoDto } from './dto/sso.dto';

@Injectable()
export class SsoService {
  constructor(
    @InjectRepository(SsoConfig) private readonly configRepo: Repository<SsoConfig>,
    @InjectRepository(SsoSession) private readonly sessionRepo: Repository<SsoSession>,
  ) {}

  async configureSso(tenantId: string, dto: ConfigureSsoDto): Promise<SsoConfig> {
    let config = await this.configRepo.findOne({ where: { tenantId } });
    if (config) {
      Object.assign(config, dto);
    } else {
      config = this.configRepo.create({ ...dto, tenantId });
    }
    return this.configRepo.save(config);
  }

  async getSsoConfig(tenantId: string): Promise<SsoConfig | null> {
    return this.configRepo.findOne({ where: { tenantId } });
  }

  async testConnection(tenantId: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: 'SSO connection test successful (mock)' };
  }

  listSsoSessions(tenantId: string): Promise<SsoSession[]> {
    return this.sessionRepo.find({ where: { tenantId }, order: { lastLoginAt: 'DESC' } });
  }

  getCallbackUrl(tenantId: string): { callbackUrl: string } {
    return { callbackUrl: `https://app.leadai.io/auth/sso/callback` };
  }
}
