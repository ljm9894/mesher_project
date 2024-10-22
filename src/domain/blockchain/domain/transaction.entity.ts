import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlockEntity } from './blockchain.domain';
import { TransactionReceiptEntity } from './transaction-receipt.entity';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionHash: string;

  @Column()
  fromAddress: string;

  @Column()
  toAddress: string;
  
  @Column()
  value: string;

  @ManyToOne(() => BlockEntity, (block) => block.transactions)
  block: BlockEntity;

  @OneToOne(() => TransactionReceiptEntity, (receipt) => receipt.transaction)
  receipt: TransactionReceiptEntity;
}
