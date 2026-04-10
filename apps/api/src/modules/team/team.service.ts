import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { InviteTeamMemberDto, UpdateTeamMemberDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(tenantId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { tenantId },
      order: { createdAt: 'ASC' },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'role',
        'isActive',
        'tenantId',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async invite(dto: InviteTeamMemberDto, tenantId: string): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
      role: dto.role,
      tenantId,
      isActive: true,
    });

    const saved = await this.userRepository.save(user);
    // Return without passwordHash
    const { passwordHash: _pw, ...result } = saved as User & { passwordHash: string };
    return result as User;
  }

  async update(id: string, dto: UpdateTeamMemberDto, tenantId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'role',
        'isActive',
        'tenantId',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new NotFoundException('Team member not found');
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId },
    });
    if (!user) {
      throw new NotFoundException('Team member not found');
    }

    user.isActive = false;
    await this.userRepository.save(user);
  }
}
