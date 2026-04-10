import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportType } from './entities/report.entity';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
  ) {}

  async findAll(tenantId: string): Promise<Report[]> {
    return this.repo.find({ where: { tenantId } });
  }

  async create(tenantId: string, dto: CreateReportDto): Promise<Report> {
    const report = this.repo.create({ ...dto, tenantId });
    return this.repo.save(report);
  }

  async findOne(tenantId: string, id: string): Promise<Report> {
    const report = await this.repo.findOne({ where: { id, tenantId } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async update(tenantId: string, id: string, dto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(tenantId, id);
    Object.assign(report, dto);
    return this.repo.save(report);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const report = await this.findOne(tenantId, id);
    await this.repo.remove(report);
  }

  async runReport(tenantId: string, id: string): Promise<{ report: Report; data: any[] }> {
    const report = await this.findOne(tenantId, id);
    report.lastRunAt = new Date();
    await this.repo.save(report);

    const mockData: Record<ReportType, any[]> = {
      [ReportType.LEADS]: [{ id: '1', name: 'Lead A', score: 85 }, { id: '2', name: 'Lead B', score: 72 }],
      [ReportType.CAMPAIGNS]: [{ id: '1', name: 'Campaign A', opens: 450, clicks: 120 }],
      [ReportType.PIPELINE]: [{ stage: 'Prospect', count: 12, value: 24000 }],
      [ReportType.REVENUE]: [{ month: 'Jan', revenue: 12000 }, { month: 'Feb', revenue: 15000 }],
      [ReportType.ACTIVITY]: [{ type: 'email', count: 45 }, { type: 'call', count: 12 }],
    };

    return { report, data: mockData[report.type] ?? [] };
  }

  async exportReport(tenantId: string, id: string): Promise<string> {
    const report = await this.findOne(tenantId, id);
    return `id,name,type,createdAt\n${report.id},${report.name},${report.type},${report.createdAt.toISOString()}`;
  }
}
