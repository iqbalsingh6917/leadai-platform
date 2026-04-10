import { IsString, IsOptional } from 'class-validator';

export class CopilotChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsString()
  sessionId: string;
}
