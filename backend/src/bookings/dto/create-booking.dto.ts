import { IsISO8601, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  courtId!: string;

  @IsISO8601()
  startAt!: string;
}

