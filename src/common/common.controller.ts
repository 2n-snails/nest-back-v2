import { Controller, Get } from '@nestjs/common';

@Controller('common')
export class CommonController {
  // 거래지역 가져오기
  @Get('address')
  getAddress() {
    return;
  }

  // 가테고리 가져오기
  @Get('category')
  getCategory() {
    return;
  }
}
