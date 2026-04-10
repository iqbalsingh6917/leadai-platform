import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { PipelinesModule } from './modules/pipelines/pipelines.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ActivityModule } from './modules/activity/activity.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TeamModule } from './modules/team/team.module';
import { EmailTemplatesModule } from './modules/email-templates/email-templates.module';
import { EmailSequencesModule } from './modules/email-sequences/email-sequences.module';
import { BillingModule } from './modules/billing/billing.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { WhatsAppDripModule } from './modules/whatsapp-drip/whatsapp-drip.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { CopilotModule } from './modules/copilot/copilot.module';
import { WhiteLabelModule } from './modules/white-label/white-label.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { RolesModule } from './modules/roles/roles.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PartnersModule } from './modules/partners/partners.module';
import { ByoaiModule } from './modules/byoai/byoai.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AiMarketplaceModule } from './modules/ai-marketplace/ai-marketplace.module';
import { VideoAiModule } from './modules/video-ai/video-ai.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { SsoModule } from './modules/sso/sso.module';
import { TelephonyModule } from './modules/telephony/telephony.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'leadai'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LeadsModule,
    ContactsModule,
    PipelinesModule,
    CampaignsModule,
    AnalyticsModule,
    ActivityModule,
    WebhooksModule,
    NotificationsModule,
    TeamModule,
    EmailTemplatesModule,
    EmailSequencesModule,
    BillingModule,
    WhatsAppModule,
    WhatsAppDripModule,
    WorkflowsModule,
    CopilotModule,
    WhiteLabelModule,
    IntegrationsModule,
    I18nModule,
    RolesModule,
    WorkspacesModule,
    ReportsModule,
    PartnersModule,
    ByoaiModule,
    CommerceModule,
    ComplianceModule,
    AiMarketplaceModule,
    VideoAiModule,
    DeveloperModule,
    SsoModule,
    TelephonyModule,
  ],
})
export class AppModule {}
