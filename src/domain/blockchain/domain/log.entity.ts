import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionReceiptEntity } from './transaction-receipt.entity';

@Entity('log')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logIndex: number;

  @Column('longtext')
  data: string;

  @Column('simple-array')
  topics: string[];

  @ManyToOne(() => TransactionReceiptEntity, (receipt) => receipt.logs)
  receipt: TransactionReceiptEntity;
}
