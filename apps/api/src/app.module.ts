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
  ],
})
export class AppModule {}
