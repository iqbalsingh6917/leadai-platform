import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { WorkflowRun, WorkflowRunStatus } from './entities/workflow-run.entity';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(WorkflowRun)
    private readonly runRepository: Repository<WorkflowRun>,
  ) {}

  async findAll(tenantId: string) {
    const workflows = await this.workflowRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });

    const withCounts = await Promise.all(
      workflows.map(async (wf) => {
        const runCount = await this.runRepository.count({ where: { workflowId: wf.id } });
        const lastRun = await this.runRepository.findOne({
          where: { workflowId: wf.id },
          order: { startedAt: 'DESC' },
        });
        return { ...wf, runCount, lastRunAt: lastRun?.startedAt ?? null };
      }),
    );

    return withCounts;
  }

  async findOne(id: string, tenantId: string) {
    const workflow = await this.workflowRepository.findOne({ where: { id, tenantId } });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  async create(dto: CreateWorkflowDto, tenantId: string) {
    const workflow = this.workflowRepository.create({ ...dto, tenantId });
    return this.workflowRepository.save(workflow);
  }

  async update(id: string, dto: UpdateWorkflowDto, tenantId: string) {
    const workflow = await this.findOne(id, tenantId);
    Object.assign(workflow, dto);
    return this.workflowRepository.save(workflow);
  }

  async remove(id: string, tenantId: string) {
    const workflow = await this.findOne(id, tenantId);
    await this.workflowRepository.remove(workflow);
  }

  async triggerWorkflow(workflowId: string, inputData: Record<string, any>, tenantId: string) {
    const workflow = await this.findOne(workflowId, tenantId);
    const run = this.runRepository.create({
      workflowId: workflow.id,
      tenantId,
      status: WorkflowRunStatus.RUNNING,
      inputData,
      outputData: {},
    });
    const savedRun = await this.runRepository.save(run);

    // Execute steps asynchronously (fire and forget)
    this._executeWorkflow(savedRun.id, workflow).catch(() => {});
    return savedRun;
  }

  async getWorkflowRuns(workflowId: string, tenantId: string) {
    await this.findOne(workflowId, tenantId);
    return this.runRepository.find({
      where: { workflowId },
      order: { startedAt: 'DESC' },
      take: 50,
    });
  }

  private async _executeWorkflow(runId: string, workflow: Workflow) {
    try {
      const steps = workflow.definition?.steps ?? [];
      const outputData: Record<string, any> = { stepsExecuted: steps.length };

      await this.runRepository.update(runId, {
        status: WorkflowRunStatus.COMPLETED,
        completedAt: new Date(),
        outputData,
      });
    } catch (err: any) {
      await this.runRepository.update(runId, {
        status: WorkflowRunStatus.FAILED,
        completedAt: new Date(),
        error: err?.message ?? 'Unknown error',
      });
    }
  }
}
