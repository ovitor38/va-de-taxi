import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { HasherAdapterModule } from 'src/adapters/hasher/hasher.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HasherAdapterModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
