import { StateType } from './../../entity/state.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChangeProductStateDto {
  @IsString()
  @IsIn(['sale', 'sold', 'wish', 'reservation', 'delete'], {
    message:
      'sale(판매중), sold(판매완료), wish(찜), reservation(예약), delete(삭제됨)',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['sale', 'sold', 'wish', 'reservation', 'delete'] })
  state: StateType;

  @ApiProperty({ description: '예약한 유저 번호 또는 구매한 유저 번호' })
  @IsNumberString()
  @IsOptional()
  user_no?: number;
}
