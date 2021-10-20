import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocketClient {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({ type: 'varchar', length: 50 })
  client_id: string;

  @Column({ type: 'integer' })
  user_no: number;
}
