import { ApiTags } from '@nestjs/swagger';
import { AddressCity } from './../entity/address_city.entity';
import { CommonService } from './common.service';
import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/entity/category.entity';

@ApiTags('common')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // 거래지역 가져오기
  @Get('address')
  async getAddress(): Promise<AddressCity[]> {
    return await this.commonService.getAllAddress();
  }

  // 가테고리 가져오기
  @Get('category')
  async getCategory(): Promise<Category[]> {
    return await this.commonService.getAllCategory();
  }
}
