import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CopilotChatDto } from './dto/copilot.dto';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }

  async chat(dto: CopilotChatDto, tenantId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/agents/run`,
          {
            task_type: 'copilot_chat',
            lead_id: dto.leadId ?? '',
            tenant_id: tenantId,
            input_data: {
              message: dto.message,
              session_id: dto.sessionId,
              lead_context: dto.leadId ? { lead_id: dto.leadId } : {},
            },
          },
          { timeout: 30000 },
        ),
      );
      const result = response.data?.result ?? {};
      return {
        reply: result.reply ?? 'I am here to help! Ask me anything about your leads.',
        sessionId: result.session_id ?? dto.sessionId,
        suggestions: result.suggestions ?? [],
      };
    } catch (err) {
      this.logger.warn('AI copilot service unavailable, using fallback: %s', err?.message);
      return this._fallbackResponse(dto.message, dto.sessionId);
    }
  }

  private _fallbackResponse(message: string, sessionId: string) {
    const lower = message.toLowerCase();
    let reply = "I'm your AI sales copilot! I can help with lead qualification, follow-ups, and deal coaching.";
    const suggestions: string[] = [];

    if (lower.includes('score') || lower.includes('qualify')) {
      reply = 'To qualify a lead, use the BANT framework: Budget, Authority, Need, and Timeline. Would you like me to analyze a specific lead?';
      suggestions.push('Score Lead', 'View Pipeline');
    } else if (lower.includes('follow') || lower.includes('email')) {
      reply = 'For follow-ups, personalize your message based on the lead\'s last interaction. Timing is key — follow up within 24 hours of initial contact.';
      suggestions.push('Send Email', 'Schedule Call');
    } else if (lower.includes('deal') || lower.includes('close')) {
      reply = 'To close deals faster, identify the decision maker early, address objections proactively, and create urgency with time-limited offers.';
      suggestions.push('View Deals', 'Send Proposal');
    }

    return { reply, sessionId, suggestions };
  }
}
