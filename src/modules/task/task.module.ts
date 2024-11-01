import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskProcessor } from '../queue/task.processor';
import { BullModule } from '@nestjs/bull';
import { TASK_QUEUE } from 'src/common/contants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: TASK_QUEUE,
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskProcessor],
})
export class TaskModule {}
