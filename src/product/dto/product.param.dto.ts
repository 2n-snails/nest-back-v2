import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ProductIdParamDto {
  @ApiProperty({ description: '상품 ID' })
  @IsNumberString()
  product_id: number;
}
