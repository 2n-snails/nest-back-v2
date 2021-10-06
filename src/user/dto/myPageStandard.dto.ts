import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
export class MyPageStandardDTO {
  @IsString()
  @IsIn(['sale', 'sold', 'buy', 'wish'], {
    message: 'sale, sold, buy, wish 만 입력 가능',
  })
  @IsNotEmpty()
  @ApiProperty({ enum: ['sale', 'sold', 'buy', 'wish'] })
  standard: 'sale' | 'sold' | 'buy' | 'wish';
}
