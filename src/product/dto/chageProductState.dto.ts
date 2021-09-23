import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ChangeProductStateDto {
  @IsString()
  @IsIn(['reservation', 'sold'], {
    message: 'sold(판매완료), reservation(예약)',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['reservation', 'sold'] })
  state: string;

  @IsNumberString()
  user_no: number;
}
