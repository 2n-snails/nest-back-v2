import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ChangeProductStateDto {
  @IsString()
  @IsIn(['reservation', 'sold', 'sale'], {
    message: 'sold(판매완료), reservation(예약), sale(판매중)',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['reservation', 'sold', 'sale'] })
  state: string;

  @ApiProperty({ description: '예약한 유저 번호 또는 구매한 유저 번호' })
  @IsNumberString()
  user_no?: number;
}
