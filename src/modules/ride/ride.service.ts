import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class RideService {
  constructor(private readonly prisma: PrismaService) {}
}
