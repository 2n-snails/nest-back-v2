import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  comment_content: string;
}
