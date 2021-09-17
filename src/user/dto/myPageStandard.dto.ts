import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
export class MyPageStandardDTO {
  @IsString()
  @IsIn(['sell', 'sold', 'buy', 'wish'], {
    message: 'sell, sold, buy, wish 만 입력 가능',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['sell', 'sold', 'buy', 'wish'] })
  standard: string;
}
