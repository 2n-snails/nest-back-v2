import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindProductsDto {
  @IsNumberString()
  @IsNotEmpty()
  limit: number;

  @IsNumberString()
  @IsNotEmpty()
  page: number;

  @IsString()
  @IsOptional()
  parent?: string;

  @IsString()
  @IsOptional()
  child?: string;

  @IsString()
  @IsNotEmpty()
  title?: string;
}
