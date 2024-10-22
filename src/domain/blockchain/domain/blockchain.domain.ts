import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('Block')
export class BlockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blockNumber: number;

  @Column()
  blockHash: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction)
  transactions: TransactionEntity;
}
