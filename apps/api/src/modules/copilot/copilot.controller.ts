import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { CopilotService } from './copilot.service';
import { CopilotChatDto } from './dto/copilot.dto';

@ApiTags('copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('copilot')
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post('chat')
  chat(@Body() dto: CopilotChatDto, @GetTenant() tenantId: string) {
    return this.copilotService.chat(dto, tenantId);
  }
}
