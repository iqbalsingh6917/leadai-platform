import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner, PartnerStatus } from './entities/partner.entity';
import { Referral } from './entities/referral.entity';
import { ApplyPartnerDto } from './dto/partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
  ) {}

  async getProfile(tenantId: string): Promise<Partner> {
    const partner = await this.partnerRepo.findOne({ where: { tenantId } });
    if (!partner) throw new NotFoundException('Partner profile not found');
    return partner;
  }

  async apply(tenantId: string, dto: ApplyPartnerDto): Promise<Partner> {
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const partner = this.partnerRepo.create({
      ...dto,
      tenantId,
      referralCode,
      status: PartnerStatus.PENDING,
    });
    return this.partnerRepo.save(partner);
  }

  async getReferrals(tenantId: string): Promise<Referral[]> {
    const partner = await this.getProfile(tenantId);
    return this.referralRepo.find({ where: { partnerId: partner.id } });
  }

  async getEarnings(tenantId: string): Promise<{ totalEarnings: number; referrals: Referral[] }> {
    const partner = await this.getProfile(tenantId);
    const referrals = await this.referralRepo.find({ where: { partnerId: partner.id } });
    return { totalEarnings: Number(partner.totalEarnings), referrals };
  }

  async requestPayout(tenantId: string): Promise<{ message: string; amount: number; status: string }> {
    const partner = await this.getProfile(tenantId);
    return {
      message: 'Payout request submitted successfully',
      amount: Number(partner.totalEarnings),
      status: 'pending',
    };
  }
}
