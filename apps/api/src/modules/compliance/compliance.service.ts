import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentRecord, ConsentStatus } from './entities/consent-record.entity';
import { DataRequest, RequestStatus } from './entities/data-request.entity';
import { RecordConsentDto, CreateDataRequestDto } from './dto/compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(ConsentRecord) private readonly consentRepo: Repository<ConsentRecord>,
    @InjectRepository(DataRequest) private readonly requestRepo: Repository<DataRequest>,
  ) {}

  listConsents(tenantId: string) {
    return this.consentRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  recordConsent(tenantId: string, dto: RecordConsentDto): Promise<ConsentRecord> {
    return this.consentRepo.save(
      this.consentRepo.create({
        ...dto,
        tenantId,
        status: ConsentStatus.GRANTED,
        grantedAt: new Date(),
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      }),
    );
  }

  async withdrawConsent(tenantId: string, id: string): Promise<ConsentRecord> {
    const record = await this.consentRepo.findOne({ where: { tenantId, id } });
    if (!record) throw new NotFoundException('Consent record not found');
    record.status = ConsentStatus.WITHDRAWN;
    record.withdrawnAt = new Date();
    return this.consentRepo.save(record);
  }

  listDataRequests(tenantId: string) {
    return this.requestRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  submitDataRequest(tenantId: string, dto: CreateDataRequestDto): Promise<DataRequest> {
    return this.requestRepo.save(this.requestRepo.create({ ...dto, tenantId }));
  }

  async processDataRequest(tenantId: string, id: string, status: RequestStatus, notes?: string): Promise<DataRequest> {
    const req = await this.requestRepo.findOne({ where: { tenantId, id } });
    if (!req) throw new NotFoundException('Data request not found');
    req.status = status;
    if (notes) req.notes = notes;
    if (status === RequestStatus.COMPLETED) req.completedAt = new Date();
    return this.requestRepo.save(req);
  }

  async getSummary(tenantId: string) {
    const [consents, requests] = await Promise.all([
      this.consentRepo.find({ where: { tenantId } }),
      this.requestRepo.find({ where: { tenantId } }),
    ]);
    return {
      totalConsents: consents.length,
      granted: consents.filter((c) => c.status === ConsentStatus.GRANTED).length,
      withdrawn: consents.filter((c) => c.status === ConsentStatus.WITHDRAWN).length,
      pendingRequests: requests.filter((r) => r.status === RequestStatus.PENDING).length,
      completedRequests: requests.filter((r) => r.status === RequestStatus.COMPLETED).length,
      totalRequests: requests.length,
    };
  }
}
