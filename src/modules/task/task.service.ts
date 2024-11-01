import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TASK_QUEUE } from 'src/common/contants';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(TASK_QUEUE) private readonly taskQueue: Queue,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<TaskResponseDto> {
    const taskData = {
      ...createTaskDto,
      userId,
    };
    const createdTask = await this.prisma.task.create({ data: taskData });
    return createdTask;
  }

  async findAll(userId: number): Promise<TaskResponseDto[]> {
    const tasks = await this.prisma.task.findMany({ where: { userId } });

    return tasks;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<TaskResponseDto> {
    const task = await this.prisma.task.update({
      where: { id, userId },
      data: updateTaskDto,
    });

    return task;
  }

  async updateStatusTask(id: number, userId: number) {
    await this.taskQueue.add({
      id,
      userId,
    });
  }
  async remove(id: number, userId: number) {
    return this.prisma.task.delete({ where: { id, userId } });
  }
}
