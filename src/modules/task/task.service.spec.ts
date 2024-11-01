import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { TASK_QUEUE } from 'src/common/contants';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;
  let taskQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        PrismaService,
        {
          provide: getQueueToken(TASK_QUEUE),
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
    taskQueue = module.get<Queue>(getQueueToken(TASK_QUEUE));
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = 1;
      const createdTask: TaskResponseDto = {
        id: 1,
        ...createTaskDto,
        finished: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.task, 'create').mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto, userId);

      expect(result).toEqual(createdTask);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { ...createTaskDto, userId },
      });
    });

    it('should throw an error if there is a problem creating the task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = 1;
      jest
        .spyOn(prisma.task, 'create')
        .mockRejectedValue(new Error('Internal Server Error'));

      await expect(service.create(createTaskDto, userId)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const userId = 1;
      const tasks: TaskResponseDto[] = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          userId,
          finished: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue(tasks);

      const result = await service.findAll(userId);

      expect(result).toEqual(tasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should throw an error if there is a problem to get task list', async () => {
      const userId = 1;
      jest
        .spyOn(prisma.task, 'findMany')
        .mockRejectedValue(new Error('Internal Server Error'));

      await expect(service.findAll(userId)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const id = 1;
      const userId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const updatedTask: TaskResponseDto = {
        id,
        title: 'Updated Task',
        description: 'Updated Description',
        finished: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.task, 'update').mockResolvedValue(updatedTask);

      const result = await service.update(id, updateTaskDto, userId);

      expect(result).toEqual(updatedTask);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id, userId },
        data: updateTaskDto,
      });
    });

    it('should add a task update to the queue', async () => {
      const id = 1;
      const userId = 1;

      await service.updateStatusTask(id, userId);

      expect(taskQueue.add).toHaveBeenCalledWith({ id, userId });
    });

    it('should throw an error if there is a problem updating the task', async () => {
      const id = 1;
      const userId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      jest
        .spyOn(prisma.task, 'update')
        .mockRejectedValue(new Error('Internal Server Error'));

      await expect(service.update(id, updateTaskDto, userId)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const id = 1;
      const userId = 1;

      jest.spyOn(prisma.task, 'delete').mockResolvedValue(undefined);

      const result = await service.remove(id, userId);

      expect(result).toBe('Task deleted Succesfuly');
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id, userId },
      });
    });

    it('should throw an error if there is a problem deleting the task', async () => {
      const id = 1;
      const userId = 1;
      jest
        .spyOn(prisma.task, 'delete')
        .mockRejectedValue(new Error('Internal Server Error'));

      await expect(service.remove(id, userId)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });
});
