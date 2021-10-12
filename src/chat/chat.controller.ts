import { JwtAccessAuthGuard } from 'src/auth/guard/jwt.access.guard';
import { ChatService } from './chat.service';
import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('chatRoom')
  async findChatRoom(@Req() req: any) {
    const user = req.user;

    const result = await this.chatService.findAll(user.user_no);
    if (!result) {
      throw new NotFoundException('chat not found');
    }
    return result;
  }
}
