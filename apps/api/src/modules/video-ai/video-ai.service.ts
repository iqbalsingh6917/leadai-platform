import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoTemplate } from './entities/video-template.entity';
import { VideoJob, VideoJobStatus } from './entities/video-job.entity';
import { CreateVideoTemplateDto, CreateVideoJobDto } from './dto/video-ai.dto';

@Injectable()
export class VideoAiService {
  constructor(
    @InjectRepository(VideoTemplate) private readonly templateRepo: Repository<VideoTemplate>,
    @InjectRepository(VideoJob) private readonly jobRepo: Repository<VideoJob>,
  ) {}

  listTemplates(tenantId: string) {
    return this.templateRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  createTemplate(tenantId: string, dto: CreateVideoTemplateDto): Promise<VideoTemplate> {
    return this.templateRepo.save(this.templateRepo.create({ ...dto, tenantId }));
  }

  async getTemplate(tenantId: string, id: string): Promise<VideoTemplate> {
    const t = await this.templateRepo.findOne({ where: { tenantId, id } });
    if (!t) throw new NotFoundException('Template not found');
    return t;
  }

  async updateTemplate(tenantId: string, id: string, dto: Partial<CreateVideoTemplateDto>): Promise<VideoTemplate> {
    const t = await this.getTemplate(tenantId, id);
    Object.assign(t, dto);
    return this.templateRepo.save(t);
  }

  async deleteTemplate(tenantId: string, id: string): Promise<{ message: string }> {
    await this.getTemplate(tenantId, id);
    await this.templateRepo.delete({ tenantId, id });
    return { message: 'Template deleted' };
  }

  listJobs(tenantId: string) {
    return this.jobRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async createJob(tenantId: string, dto: CreateVideoJobDto): Promise<VideoJob> {
    const job = await this.jobRepo.save(this.jobRepo.create({ ...dto, tenantId }));
    this.processJob(job.id).catch(() => {});
    return job;
  }

  private async processJob(jobId: string): Promise<void> {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 2000));
    await this.jobRepo.update(jobId, {
      status: VideoJobStatus.COMPLETED,
      videoUrl: `https://mock-videos.leadai.io/${jobId}.mp4`,
      thumbnailUrl: `https://mock-videos.leadai.io/${jobId}-thumb.jpg`,
      processingMs: Date.now() - start,
    });
  }

  async getJob(tenantId: string, id: string): Promise<VideoJob> {
    const j = await this.jobRepo.findOne({ where: { tenantId, id } });
    if (!j) throw new NotFoundException('Job not found');
    return j;
  }

  async sendViaWhatsApp(tenantId: string, id: string): Promise<{ message: string }> {
    const j = await this.getJob(tenantId, id);
    return { message: `Video ${j.videoUrl} sent via WhatsApp (mock)` };
  }
}
