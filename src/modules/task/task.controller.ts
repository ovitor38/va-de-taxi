import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/task')
@ApiTags('task')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId: number = req.user.sub;

    return this.taskService.create(createTaskDto, +userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  findAll(@Request() req) {
    const userId: number = req.user.sub;

    return this.taskService.findAll(+userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId: number = req.user.sub;

    return this.taskService.update(+id, updateTaskDto, +userId);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a status task to complete' })
  updateStatusTask(@Request() req, @Param('id') id: string) {
    const userId: number = req.user.sub;

    return this.taskService.updateStatusTask(+id, +userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  remove(
    @Request() req,

    @Param('id') id: string,
  ) {
    const userId: number = req.user.sub;

    return this.taskService.remove(+id, +userId);
  }
}
