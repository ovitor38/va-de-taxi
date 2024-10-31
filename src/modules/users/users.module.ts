import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HasherAdapterModule } from '../../adapters/hasher/hasher.module';

@Module({
  imports: [HasherAdapterModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
