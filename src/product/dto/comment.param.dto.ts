import { IsNumberString } from 'class-validator';

export class CommentIdParamDto {
  @IsNumberString()
  comment_id: number;
}
