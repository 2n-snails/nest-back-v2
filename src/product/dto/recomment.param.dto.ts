import { IsNumberString } from 'class-validator';

export class ReCommentIdParamDto {
  @IsNumberString()
  recomment_id: number;
}
