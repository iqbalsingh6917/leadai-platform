import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SsoProvider {
  OKTA = 'okta',
  AZURE_AD = 'azure_ad',
  GOOGLE_WORKSPACE = 'google_workspace',
  SAML = 'saml',
  OIDC = 'oidc',
}

@Entity('sso_configs')
export class SsoConfig {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', unique: true }) tenantId: string;
  @Column({ type: 'enum', enum: SsoProvider, default: SsoProvider.OKTA }) provider: SsoProvider;
  @Column({ nullable: true }) clientId: string;
  @Column({ nullable: true }) clientSecret: string;
  @Column({ nullable: true }) tenantDomain: string;
  @Column({ nullable: true }) metadataUrl: string;
  @Column({ default: false }) isActive: boolean;
  @Column({ type: 'timestamp', nullable: true }) lastSyncAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
