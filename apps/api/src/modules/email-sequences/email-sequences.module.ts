import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSequencesController } from './email-sequences.controller';
import { EmailSequencesService } from './email-sequences.service';
import { EmailSequence } from './entities/sequence.entity';
import { EmailSequenceStep } from './entities/sequence-step.entity';
import { SequenceEnrollment } from './entities/sequence-enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailSequence, EmailSequenceStep, SequenceEnrollment])],
  controllers: [EmailSequencesController],
  providers: [EmailSequencesService],
  exports: [EmailSequencesService],
})
export class EmailSequencesModule {}
