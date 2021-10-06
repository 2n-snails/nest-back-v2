import { IsString } from 'class-validator';

export class CategoryArrayClass {
  @IsString()
  parent: string;

  @IsString()
  child: string;
}
