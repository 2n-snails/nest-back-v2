import { JwtAccessAuthGuard } from 'src/auth/guard/jwt.access.guard';
import { ChatService } from './chat.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('chat')
@UseGuards(JwtAccessAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({
    summary: '내가 가진 채팅방목록',
  })
  @Get(':user_id/chatRoom')
  async findChatRoom(@Req() req: any, @Param('user_id') user_id: string) {
    const paramUserId = Number(user_id);
    const tokenUserId = req.user.user_no;

    if (paramUserId !== tokenUserId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const result = await this.chatService.findAll(tokenUserId);
    if (!result.length) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @ApiOperation({
    summary: '특정방 채팅 내용',
  })
  @Get(':user_id/chatRoom/:room_id')
  async findChatContent(
    @Req() req: any,
    @Param('user_id') user_id: string,
    @Param('room_id') roomId: string,
  ) {
    const paramUserId = Number(user_id);
    const tokenUserId = req.user.user_no;

    if (!paramUserId === tokenUserId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const result = await this.chatService.findOne(parseInt(roomId));
    if (!result.length) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @ApiOperation({
    summary: '채팅 내용 업데이트',
  })
  @Post(':user_id/chatRoom/:room_id')
  async insertMessage(
    @Req() req: any,
    @Param('user_id') user_id: string,
    @Param('room_id') roomId: string,
    @Body() body: any,
  ) {
    const paramUserId = Number(user_id);
    const tokenUserId = req.user.user_no;

    if (!paramUserId === tokenUserId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { content } = body;

    const result = await this.chatService.insertMessage(
      parseInt(roomId),
      content,
    );

    return result;
  }
}
