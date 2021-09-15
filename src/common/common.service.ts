import { getRepository } from 'typeorm';
import { AddressCity } from './../entity/address_city.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  async getAllAddress(): Promise<AddressCity[]> {
    const result = await getRepository(AddressCity)
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.addressAreas', 'area')
      .select(['city.city_name', 'area.area_name'])
      .getMany();
    return result;
  }
}
