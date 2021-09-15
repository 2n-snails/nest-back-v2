import { AddressArea } from './address_area.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddressCity {
  @PrimaryGeneratedColumn()
  city_no: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  city_name: string;

  @OneToMany(() => AddressArea, (addressArea) => addressArea.addressCity)
  addressAreas: AddressArea[];
}
