import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            updateStatusTask: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useClass: AuthGuard,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
    };
    const userId = 1;
    const req = { user: { sub: userId } };
    const result: TaskResponseDto = {
      id: 1,
      ...createTaskDto,
      userId,
      finished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(taskService, 'create').mockResolvedValue(result);

    expect(await controller.create(createTaskDto, req)).toBe(result);
    expect(taskService.create).toHaveBeenCalledWith(createTaskDto, userId);
  });

  it('should return all tasks for a user', async () => {
    const userId = 1;
    const req = { user: { sub: userId } };
    const tasks: TaskResponseDto[] = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        finished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      },
    ];

    jest.spyOn(taskService, 'findAll').mockResolvedValue(tasks);

    expect(await controller.findAll(req)).toBe(tasks);
    expect(taskService.findAll).toHaveBeenCalledWith(userId);
  });

  it('should update a task', async () => {
    const id = '1';
    const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
    const userId = 1;
    const req = { user: { sub: userId } };
    const updatedTask = {
      id: +id,
      title: 'Updated Task',
      description: 'Updated Description',
      userId,
      finished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(taskService, 'update').mockResolvedValue(updatedTask);

    expect(await controller.update(req, id, updateTaskDto)).toBe(updatedTask);
    expect(taskService.update).toHaveBeenCalledWith(+id, updateTaskDto, userId);
  });

  it('should update the status of a task', async () => {
    const id = '1';
    const userId = 1;
    const req = { user: { sub: userId } };

    jest.spyOn(taskService, 'updateStatusTask').mockResolvedValue(undefined);

    await controller.updateStatusTask(req, id);

    expect(taskService.updateStatusTask).toHaveBeenCalledWith(+id, userId);
  });

  it('should delete a task', async () => {
    const id = '1';
    const userId = 1;
    const req = { user: { sub: userId } };
    const result = 'Task deleted Succesfuly';

    jest.spyOn(taskService, 'remove').mockResolvedValue(result);

    expect(await controller.remove(req, id)).toBe(result);
    expect(taskService.remove).toHaveBeenCalledWith(+id, userId);
  });
});
