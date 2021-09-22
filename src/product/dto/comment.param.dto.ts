import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CommentIdParamDto {
  @ApiProperty({ description: '댓글 ID' })
  @IsNumberString()
  comment_id: number;
}
