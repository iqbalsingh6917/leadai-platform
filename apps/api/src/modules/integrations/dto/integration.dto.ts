import { IsString, IsOptional, IsObject } from 'class-validator';

export class ConnectIntegrationDto {
  @IsString() provider: string;
  @IsOptional() @IsObject() config?: Record<string, any>;
}
