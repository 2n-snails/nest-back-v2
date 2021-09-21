import { Category } from './../entity/category.entity';
import { getRepository } from 'typeorm';
import { AddressCity } from './../entity/address_city.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  async getAllAddress(): Promise<AddressCity[]> {
    const result = await getRepository(AddressCity)
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.addressAreas', 'area')
      .getMany();
    return result;
  }

  async getAllCategory(): Promise<Category[]> {
    const result = await getRepository(Category)
      .createQueryBuilder('category')
      .getMany();
    return result;
  }
}
