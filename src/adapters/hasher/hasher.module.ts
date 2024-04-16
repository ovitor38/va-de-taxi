import { Module } from '@nestjs/common';
import { HasherAdapter } from './hasher.adapter';

@Module({
  providers: [HasherAdapter],
  exports: [HasherAdapter],
})
export class HasherAdapterModule {}
