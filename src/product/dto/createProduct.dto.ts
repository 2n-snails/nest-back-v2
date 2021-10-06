import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CategoryArrayClass } from '../common/category.type';

export class CreateProductDto {
  @ApiProperty({ description: '상품 이름' })
  @IsString()
  @IsNotEmpty()
  product_title: string;

  @ApiProperty({ description: '상품 설명' })
  @IsString()
  @IsNotEmpty()
  product_content: string;

  @ApiProperty({ description: '상품 가격' })
  @IsString()
  @IsNotEmpty()
  product_price: string;

  @ApiProperty({ description: '상품 이미지' })
  @IsArray()
  @ArrayMinSize(1, {
    message: '상품 이미지는 한개 이상 필수 등록입니다.',
  })
  image: string[];

  @ApiProperty({ description: '상품 카테고리' })
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

  @ApiProperty({ description: '상품 거래 희망 지역' })
  @IsArray()
  @ArrayMinSize(1, {
    message: '거래희망지역은 한개 이상 필수 등록입니다.',
  })
  deal: string[];
}
