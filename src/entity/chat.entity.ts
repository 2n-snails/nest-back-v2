import { Product } from 'src/entity/product.entity';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chat_no: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'json' })
  content: JSON;

  @ManyToOne(() => User, (user) => user.userSeller)
  @JoinColumn({ name: 'seller' })
  seller: User;

  @ManyToOne(() => User, (user) => user.userBuyer)
  @JoinColumn({ name: 'buyer' })
  buyer: User;

  @ManyToOne(() => Product, (product) => product.chats)
  @JoinColumn({ name: 'chat_product_no' })
  product: Product;
}
