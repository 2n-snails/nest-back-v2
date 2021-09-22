import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ReCommentIdParamDto {
  @ApiProperty({ description: '대댓글 ID' })
  @IsNumberString()
  recomment_id: number;
}
