import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { TaskResponseDto } from './dto/task-response.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
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

  async updateStatusTask(id: number, userId: number): Promise<TaskResponseDto> {
    const task = await this.prisma.task.update({
      where: { id, userId },
      data: { finished: true },
    });

    return task;
  }
  async remove(id: number, userId: number) {
    return this.prisma.task.delete({ where: { id, userId } });
  }
}
