import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class SearchDto {
  @ApiProperty({ description: '상품 갯수', default: 5 })
  @IsNumberString()
  @IsNotEmpty()
  limit: number;

  @ApiProperty({ description: '페이지 번호', default: 1 })
  @IsNumberString()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: '검색할 이름' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
