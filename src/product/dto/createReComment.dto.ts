import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReCommentDto {
  @ApiProperty({ description: '대댓글 내용' })
  @IsString()
  recomment_content: string;
}
