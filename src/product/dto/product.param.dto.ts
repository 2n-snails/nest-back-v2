import { IsNumberString } from 'class-validator';

export class ProductIdParamDto {
  @IsNumberString()
  product_id: number;
}
