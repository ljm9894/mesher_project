import { Module } from '@nestjs/common';
import { BlockChainService } from '../blockchain/blockchain.service';
import { SlackService } from './slack.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from '../blockchain/domain/blockchain.entity';
import { TransactionEntity } from '../blockchain/domain/transaction.entity';
import { TransactionReceiptEntity } from '../blockchain/domain/transaction-receipt.entity';
import { LogEntity } from '../blockchain/domain/log.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';
import { SentryExceptionFilter } from 'src/global/filter/sentry.filter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BlockchainModule,
    TypeOrmModule.forFeature([
      BlockEntity,
      TransactionEntity,
      TransactionReceiptEntity,
      LogEntity,
    ]),
  ],
  providers: [BlockChainService, SlackService],
})
export class SlackModule {}
