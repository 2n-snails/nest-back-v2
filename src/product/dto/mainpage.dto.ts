import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class MainPageDto {
  @ApiProperty({ description: '상품 갯수', default: 5 })
  @IsNumberString()
  @IsNotEmpty()
  limit: number;

  @ApiProperty({ description: '페이지 번호', default: 1 })
  @IsNumberString()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: '상위카테고리 이름(선택)' })
  @IsString()
  @IsOptional()
  parent?: string;

  @ApiProperty({ description: '하위 카테고리 이름(선택)' })
  @IsString()
  @IsOptional()
  child?: string;
}
