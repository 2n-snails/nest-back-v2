import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductState } from '../common/productState.enum';

export class ChangeProductStateDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductState, { each: true })
  state: ProductState;

  @ApiProperty({ description: '예약한 유저 번호 또는 구매한 유저 번호' })
  @IsNumberString()
  @IsOptional()
  user_no?: number;
}
