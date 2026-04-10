import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { AVAILABLE_PERMISSIONS } from './constants/permissions';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  async findAll(tenantId: string): Promise<Role[]> {
    return this.repo.find({ where: { tenantId } });
  }

  async create(tenantId: string, dto: CreateRoleDto): Promise<Role> {
    const role = this.repo.create({ ...dto, tenantId });
    return this.repo.save(role);
  }

  async update(tenantId: string, id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.repo.findOne({ where: { id, tenantId } });
    if (!role) throw new NotFoundException('Role not found');
    Object.assign(role, dto);
    return this.repo.save(role);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    const role = await this.repo.findOne({ where: { id, tenantId } });
    if (!role) throw new NotFoundException('Role not found');
    await this.repo.remove(role);
  }

  getPermissions(): string[] {
    return AVAILABLE_PERMISSIONS;
  }
}
