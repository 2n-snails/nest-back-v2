import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class CategoryArrayClass {
  @IsString()
  parent: string;

  @IsString()
  child: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_title: string;

  @IsString()
  @IsNotEmpty()
  product_content: string;

  @IsString()
  @IsNotEmpty()
  product_price: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: '상품 이미지는 한개 이상 필수 등록입니다.',
  })
  image: string[];

  @IsArray()
  @ValidateNested({
    each: true,
    message: '상위 카테고리 하위 카테고리를 정확히 입력해주세요.',
  })
  @Type(() => CategoryArrayClass)
  @ArrayMinSize(1, {
    message: '상품 카테고리는 한개 이상 필수 등록입니다.',
  })
  category: CategoryArrayClass[];

  @IsArray()
  @ArrayMinSize(1, {
    message: '거래희망지역은 한개 이상 필수 등록입니다.',
  })
  deal: string[];
}
