import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from './domain/blockchain.domain';
import { BlockChainService } from './blockchain.service';
import { TransactionEntity } from './domain/transaction.entity';
import { TransactionReceiptEntity } from './domain/transaction-receipt.entity';
import { LogEntity } from './domain/log.entity';
import { BlockChainController } from './blockchain.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlockEntity,
      TransactionEntity,
      TransactionReceiptEntity,
      LogEntity,
    ]),
  ],
  controllers: [BlockChainController],
  providers: [BlockChainService],
})
export class BlockchainModule {}
