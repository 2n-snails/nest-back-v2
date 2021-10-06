import { Product } from 'src/entity/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

export type StateType = 'sale' | 'sold' | 'wish' | 'reservation' | 'delete';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  state_no: number;

  @Column({
    type: 'enum',
    enum: ['sale', 'sold', 'wish', 'reservation', 'delete'],
    default: 'sale',
  })
  state: StateType;

  @Column({ type: 'varchar', nullable: true })
  review_state: string;

  @ManyToOne(() => User, (user) => user.state, { nullable: true })
  @JoinColumn({ name: 'user_no' })
  user: User;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_no' })
  product: Product;
}
