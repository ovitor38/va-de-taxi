import { PartialType } from '@nestjs/swagger';
import { CreateRideDto } from './create-ride.dto';

enum StatusRide {
  inProgress = 'EM_ANDAMENTO',
  finishe = 'FINALIZADA',
}
export class UpdateRideDto extends PartialType(CreateRideDto) {
  driverId: string;
  status: StatusRide;
}
