import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceAgent, AgentCategory } from './entities/marketplace-agent.entity';
import { AgentInstallation } from './entities/agent-installation.entity';
import { PublishAgentDto, InstallAgentDto } from './dto/marketplace.dto';

const SEED_AGENTS = [
  { name: 'LeadScorer Pro', slug: 'lead-scorer-pro', description: 'AI-powered lead scoring using behavioral signals and demographic data', category: AgentCategory.SCORING, price: 0, rating: 4.8, installCount: 2341, isOfficial: true, tags: ['scoring', 'ai', 'leads'] },
  { name: 'Intent Analyzer', slug: 'intent-analyzer', description: 'Detects purchase intent from email and chat interactions', category: AgentCategory.ANALYTICS, price: 19, rating: 4.6, installCount: 1823, isOfficial: true, tags: ['intent', 'nlp'] },
  { name: 'Deal Coach', slug: 'deal-coach', description: 'Real-time coaching suggestions during sales calls', category: AgentCategory.COMMUNICATION, price: 29, rating: 4.7, installCount: 1204, isOfficial: true, tags: ['coaching', 'sales'] },
  { name: 'Revenue Forecaster', slug: 'revenue-forecaster', description: 'ML-based revenue forecasting with confidence intervals', category: AgentCategory.ANALYTICS, price: 39, rating: 4.5, installCount: 987, isOfficial: true, tags: ['forecasting', 'revenue'] },
  { name: 'Sentiment Monitor', slug: 'sentiment-monitor', description: 'Real-time sentiment analysis across all customer touchpoints', category: AgentCategory.ANALYTICS, price: 0, rating: 4.4, installCount: 3102, isOfficial: true, tags: ['sentiment', 'nlp'] },
  { name: 'Auto Drip Builder', slug: 'auto-drip-builder', description: 'Automatically builds optimal drip sequences based on lead behavior', category: AgentCategory.AUTOMATION, price: 19, rating: 4.3, installCount: 756, isOfficial: false, tags: ['drip', 'automation'] },
  { name: 'WhatsApp Responder', slug: 'whatsapp-responder', description: 'Intelligent auto-responses for WhatsApp conversations', category: AgentCategory.COMMUNICATION, price: 0, rating: 4.6, installCount: 2891, isOfficial: true, tags: ['whatsapp', 'chat'] },
  { name: 'Pipeline Optimizer', slug: 'pipeline-optimizer', description: 'Identifies bottlenecks and suggests pipeline optimizations', category: AgentCategory.AUTOMATION, price: 29, rating: 4.2, installCount: 534, isOfficial: false, tags: ['pipeline', 'optimization'] },
  { name: 'Email Subject Tester', slug: 'email-subject-tester', description: 'Predicts email open rates for subject lines before sending', category: AgentCategory.COMMUNICATION, price: 0, rating: 4.5, installCount: 4201, isOfficial: true, tags: ['email', 'testing'] },
  { name: 'Churn Predictor', slug: 'churn-predictor', description: 'Identifies at-risk accounts before they churn', category: AgentCategory.SCORING, price: 49, rating: 4.7, installCount: 892, isOfficial: true, tags: ['churn', 'retention'] },
  { name: 'Contact Enricher', slug: 'contact-enricher', description: 'Auto-enriches contact profiles with social and firmographic data', category: AgentCategory.AUTOMATION, price: 0, rating: 4.1, installCount: 1567, isOfficial: false, tags: ['enrichment', 'contacts'] },
  { name: 'Meeting Scheduler', slug: 'meeting-scheduler', description: 'AI-powered meeting time optimization and scheduling', category: AgentCategory.COMMUNICATION, price: 19, rating: 4.4, installCount: 1089, isOfficial: false, tags: ['scheduling', 'meetings'] },
  { name: 'Competitor Tracker', slug: 'competitor-tracker', description: 'Monitors competitor mentions in customer conversations', category: AgentCategory.ANALYTICS, price: 39, rating: 4.3, installCount: 423, isOfficial: false, tags: ['competitive', 'intelligence'] },
  { name: 'Voice Transcriber', slug: 'voice-transcriber', description: 'Transcribes and summarizes sales calls with action items', category: AgentCategory.COMMUNICATION, price: 29, rating: 4.6, installCount: 1345, isOfficial: true, tags: ['transcription', 'calls'] },
  { name: 'Smart Segmentation', slug: 'smart-segmentation', description: 'Dynamic audience segmentation using ML clustering', category: AgentCategory.ANALYTICS, price: 0, rating: 4.5, installCount: 2103, isOfficial: true, tags: ['segmentation', 'ml'] },
  { name: 'Follow-up Reminder', slug: 'follow-up-reminder', description: 'Intelligent follow-up timing recommendations per lead', category: AgentCategory.AUTOMATION, price: 0, rating: 4.2, installCount: 3456, isOfficial: false, tags: ['followup', 'reminders'] },
  { name: 'Persona Builder', slug: 'persona-builder', description: 'Auto-generates buyer personas from your CRM data', category: AgentCategory.SCORING, price: 19, rating: 4.0, installCount: 678, isOfficial: false, tags: ['persona', 'buyer'] },
  { name: 'Campaign ROI Analyzer', slug: 'campaign-roi-analyzer', description: 'Real-time ROI calculation across all marketing channels', category: AgentCategory.ANALYTICS, price: 29, rating: 4.4, installCount: 891, isOfficial: true, tags: ['roi', 'campaigns'] },
  { name: 'Language Translator', slug: 'language-translator', description: 'Auto-translates outreach messages to prospect language', category: AgentCategory.COMMUNICATION, price: 0, rating: 4.3, installCount: 1782, isOfficial: false, tags: ['translation', 'i18n'] },
  { name: 'Custom Workflow Bot', slug: 'custom-workflow-bot', description: 'Build custom AI workflows with drag-and-drop interface', category: AgentCategory.CUSTOM, price: 49, rating: 4.1, installCount: 312, isOfficial: false, tags: ['custom', 'workflow'] },
];

@Injectable()
export class AiMarketplaceService {
  constructor(
    @InjectRepository(MarketplaceAgent) private readonly agentRepo: Repository<MarketplaceAgent>,
    @InjectRepository(AgentInstallation) private readonly installRepo: Repository<AgentInstallation>,
  ) {}

  async listAgents(category?: string, priceFilter?: string, search?: string): Promise<MarketplaceAgent[]> {
    const agents = await this.agentRepo.find({ where: { isPublished: true }, order: { installCount: 'DESC' } });
    if (agents.length === 0) {
      return SEED_AGENTS.filter((a) => {
        if (category && category !== 'all' && a.category !== category) return false;
        if (priceFilter === 'free' && a.price > 0) return false;
        if (priceFilter === 'paid' && a.price === 0) return false;
        if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }) as unknown as MarketplaceAgent[];
    }
    return agents;
  }

  async getAgent(id: string): Promise<MarketplaceAgent> {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async installAgent(tenantId: string, agentId: string, dto: InstallAgentDto): Promise<AgentInstallation> {
    const existing = await this.installRepo.findOne({ where: { tenantId, agentId } });
    if (existing) {
      existing.isActive = true;
      if (dto.customConfig) existing.customConfig = dto.customConfig;
      return this.installRepo.save(existing);
    }
    return this.installRepo.save(
      this.installRepo.create({ tenantId, agentId, customConfig: dto.customConfig }),
    );
  }

  async uninstallAgent(tenantId: string, agentId: string): Promise<{ message: string }> {
    await this.installRepo.delete({ tenantId, agentId });
    return { message: 'Agent uninstalled' };
  }

  getInstalledAgents(tenantId: string): Promise<AgentInstallation[]> {
    return this.installRepo.find({ where: { tenantId }, order: { installedAt: 'DESC' } });
  }

  async publishAgent(tenantId: string, dto: PublishAgentDto): Promise<MarketplaceAgent> {
    return this.agentRepo.save(
      this.agentRepo.create({ ...dto, authorTenantId: tenantId, isPublished: true }),
    );
  }
}
