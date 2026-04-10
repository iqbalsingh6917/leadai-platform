import { IsString, IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString() name: string;
  @IsOptional() @IsString() plan?: string;
}

export class UpdateWorkspaceDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() plan?: string;
}
