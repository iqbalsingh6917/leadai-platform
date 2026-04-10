import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneNumber, TelephonyProvider } from './entities/phone-number.entity';
import { CallLog, CallDirection, CallStatus, CallSentiment } from './entities/call-log.entity';
import { ProvisionNumberDto, InitiateCallDto } from './dto/telephony.dto';

@Injectable()
export class TelephonyService {
  constructor(
    @InjectRepository(PhoneNumber) private readonly numberRepo: Repository<PhoneNumber>,
    @InjectRepository(CallLog) private readonly callRepo: Repository<CallLog>,
  ) {}

  listPhoneNumbers(tenantId: string) {
    return this.numberRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async provisionNumber(tenantId: string, dto: ProvisionNumberDto): Promise<PhoneNumber> {
    const number = `+${dto.countryCode}${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    return this.numberRepo.save(
      this.numberRepo.create({ ...dto, tenantId, number }),
    );
  }

  async deleteNumber(tenantId: string, id: string): Promise<{ message: string }> {
    const n = await this.numberRepo.findOne({ where: { tenantId, id } });
    if (!n) throw new NotFoundException('Phone number not found');
    await this.numberRepo.delete({ tenantId, id });
    return { message: 'Phone number released' };
  }

  listCallLogs(tenantId: string) {
    return this.callRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async getCallLog(tenantId: string, id: string): Promise<CallLog> {
    const c = await this.callRepo.findOne({ where: { tenantId, id } });
    if (!c) throw new NotFoundException('Call log not found');
    return c;
  }

  async initiateCall(tenantId: string, dto: InitiateCallDto): Promise<CallLog> {
    const call = await this.callRepo.save(
      this.callRepo.create({
        ...dto,
        tenantId,
        direction: CallDirection.OUTBOUND,
        status: CallStatus.INITIATED,
      }),
    );
    setTimeout(async () => {
      await this.callRepo.update(call.id, {
        status: CallStatus.COMPLETED,
        duration: Math.floor(Math.random() * 300) + 30,
        sentiment: CallSentiment.NEUTRAL,
        aiSummary: 'Mock call completed. Lead expressed interest in the product.',
        transcript: '[00:00] Agent: Hello...\n[00:05] Lead: Hi, I wanted to learn more...',
      });
    }, 3000);
    return call;
  }

  async updateCallStatus(tenantId: string, id: string, status: CallStatus, duration?: number): Promise<CallLog> {
    const call = await this.getCallLog(tenantId, id);
    call.status = status;
    if (duration !== undefined) call.duration = duration;
    return this.callRepo.save(call);
  }

  async getStats(tenantId: string): Promise<object> {
    const calls = await this.callRepo.find({ where: { tenantId } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCalls = calls.filter((c) => new Date(c.createdAt) >= today);
    const completed = calls.filter((c) => c.status === CallStatus.COMPLETED);
    const avgDuration = completed.length ? Math.round(completed.reduce((s, c) => s + c.duration, 0) / completed.length) : 0;
    return {
      totalCalls: calls.length,
      avgDuration,
      answerRate: calls.length ? Math.round((completed.length / calls.length) * 100) : 0,
      missedToday: todayCalls.filter((c) => c.status === CallStatus.MISSED).length,
    };
  }
}
