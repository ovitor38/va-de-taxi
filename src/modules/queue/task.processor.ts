import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { TASK_QUEUE } from 'src/common/contants';

@Injectable()
@Processor(TASK_QUEUE)
export class TaskProcessor {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger(TaskProcessor.name);

  @Process()
  async process(job: Job) {
    try {
      this.logger.log('Updating Task');

      const { id, userId } = job.data;

      await this.prisma.task.update({
        where: { id, userId },
        data: { finished: true },
      });
      this.logger.log('Task updated successufully');
    } catch (error) {
      this.logger.log(error);
    }
  }
}
