import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ReCommentIdParamDto {
  @ApiProperty({ description: 'λλκΈ ID' })
  @IsNumberString()
  recomment_id: number;
}
