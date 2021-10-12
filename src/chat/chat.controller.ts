import { JwtAccessAuthGuard } from 'src/auth/guard/jwt.access.guard';
import { ChatService } from './chat.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({
    summary: '내가 가진 채팅목록',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get('chatRoom')
  async findChatRoom(@Req() req: any) {
    const user = req.user;

    const result = await this.chatService.findAll(user.user_no);
    if (!result.length) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @ApiOperation({
    summary: '채팅 내용',
  })
  @UseGuards(JwtAccessAuthGuard)
  @Get('chatContent/:room_id')
  async findChatContent(@Req() req: any, @Param('room_id') roomId: string) {
    const result = await this.chatService.findOne(parseInt(roomId));
    if (!result.length) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
