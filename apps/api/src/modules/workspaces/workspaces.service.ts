import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace, WorkspaceStatus } from './entities/workspace.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private readonly memberRepo: Repository<WorkspaceMember>,
  ) {}

  async findAll(tenantId: string): Promise<Workspace[]> {
    return this.workspaceRepo.find({ where: { tenantId } });
  }

  async create(tenantId: string, dto: CreateWorkspaceDto): Promise<Workspace> {
    const suffix = Math.random().toString(36).substring(2, 6);
    const slug = `${dto.name.toLowerCase().replace(/\s+/g, '-')}-${suffix}`;
    const workspace = this.workspaceRepo.create({ ...dto, tenantId, slug });
    return this.workspaceRepo.save(workspace);
  }

  async update(tenantId: string, id: string, dto: UpdateWorkspaceDto): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findOne({ where: { id, tenantId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    Object.assign(workspace, dto);
    return this.workspaceRepo.save(workspace);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const workspace = await this.workspaceRepo.findOne({ where: { id, tenantId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    await this.workspaceRepo.remove(workspace);
  }

  async suspend(tenantId: string, id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findOne({ where: { id, tenantId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    workspace.status = WorkspaceStatus.SUSPENDED;
    return this.workspaceRepo.save(workspace);
  }

  async switch(tenantId: string, id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findOne({ where: { id, tenantId } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }
}
