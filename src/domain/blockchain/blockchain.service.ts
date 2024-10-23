import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockEntity } from './domain/blockchain.entity';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { TransactionEntity } from './domain/transaction.entity';
import { TransactionReceiptEntity } from './domain/transaction-receipt.entity';
import { LogEntity } from './domain/log.entity';

@Injectable()
export class BlockChainService {
  private provider: any;
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionReceiptEntity)
    private readonly receiptRepository: Repository<TransactionReceiptEntity>,
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
    private readonly configService: ConfigService,
  ) {
    const url: string = `https://mainnet.infura.io/v3/${this.configService.get<string>('INFURA_API_KEY')}`;
    this.provider = new ethers.JsonRpcProvider(url);
  }
  async fetchLatestBlock(): Promise<void> {
    const latestBlockNumber = await this.provider.getBlockNumber();
    const block = await this.provider.getBlock(latestBlockNumber, true);
    const blockEntity = this.blockRepository.create({
      blockNumber: block.number,
      blockHash: block.hash,
    });
    // console.log(block);
    // console.log(block.transactions);
    await this.blockRepository.save(blockEntity);
    for (const txHash of block.transactions) {
      const tx = await this.provider.getTransaction(txHash);
      const transactionEntity = this.transactionRepository.create({
        transactionHash: tx.hash,
        fromAddress: tx.from,
        toAddress: tx.to,
        value: tx.value ? ethers.formatEther(tx.value) : '0',
        block: blockEntity,
      });
      await this.transactionRepository.insert(transactionEntity);

      const receipt = await this.provider.getTransactionReceipt(txHash);
      const receiptEntity = this.receiptRepository.create({
        status: receipt.status,
        gasUsed: receipt.gasUsed.toString(),
        contractAddress: receipt.contractAddress,
        transaction: transactionEntity,
      });
      await this.receiptRepository.insert(receiptEntity);

      for (const log of receipt.logs) {
        const logEntity = this.logRepository.create({
          logIndex: log.index,
          data: log.data,
          topics: log.topics,
          receipt: receiptEntity,
        });
        await this.logRepository.insert(logEntity);
      }
    }
  }
  async startBlockSync() {
    setInterval(async () => {
      try {
        await this.fetchLatestBlock();
        console.log('Latest block and transactions saved');
      } catch (err) {
        console.error('Error fetching block:', err);
        throw new InternalServerErrorException();
      }
    }, 15000);
  }

  async blockRead(blockHash: string): Promise<any> {
    try {
      const findBlock: any | undefined = await this.blockRepository.findOne({
        where: {
          blockHash,
        },
        relations: [
          'transactions',
          'transactions.receipt',
          'transactions.receipt.logs',
        ],
      });
      if (!findBlock) {
        throw new NotFoundException();
      }
      return findBlock;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
  async receiptRead(transactionHash: string): Promise<any> {
    try {
      const findTransaction = await this.transactionRepository.findOne({
        where: { transactionHash },
      });

      if (!findTransaction) {
        throw new NotFoundException();
      }
      const findReceipt = await this.receiptRepository.findOne({
        where: { transaction: { id: findTransaction.id } },
        relations: ['logs'],
      });
      if (!findReceipt) {
        throw new NotFoundException();
      }
      return findReceipt;
    } catch (err) {
      console.error(err);
    }
  }
  async findReceiptByFromOrTo(option: string, address: string): Promise<any> {
    let findReceipt: any;
    let findTransaction: any;
    if (option == 'to') {
      findTransaction = await this.transactionRepository.findOne({
        where: { toAddress: address },
      });
      if (!findTransaction) {
        throw new NotFoundException();
      }
    } else if (option == 'from') {
      findTransaction = await this.transactionRepository.findOne({
        where: { fromAddress: address },
      });
      if (!findTransaction) {
        throw new NotFoundException();
      }
    } else {
      throw new BadRequestException();
    }
    findReceipt = await this.receiptRepository.findOne({
      where: { transaction: { id: findTransaction.id } },
      relations: ['logs'],
    });
    if (!findReceipt) {
      throw new NotFoundException();
    }
    return findReceipt;
  }
}
