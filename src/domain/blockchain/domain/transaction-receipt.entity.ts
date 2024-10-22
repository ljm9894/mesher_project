import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { LogEntity } from './log.entity';

@Entity('transactionReceipt')
export class TransactionReceiptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  gasUsed: string;

  @Column({ nullable: true })
  contractAddress: string;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.receipt)
  transaction: TransactionEntity;

  @OneToMany(() => LogEntity, (log) => log.receipt)
  logs: LogEntity[];
}
