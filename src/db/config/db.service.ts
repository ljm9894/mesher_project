import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { BlockEntity } from 'src/domain/blockchain/domain/blockchain.entity';
import { LogEntity } from 'src/domain/blockchain/domain/log.entity';
import { TransactionReceiptEntity } from 'src/domain/blockchain/domain/transaction-receipt.entity';
import { TransactionEntity } from 'src/domain/blockchain/domain/transaction.entity';

@Injectable()
export class MysqlConnectService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_DATABASE'),
      //   entities: [__dirname + '../../**/**/**/*.entity{.ts,.js}'],
      entities: [
        BlockEntity,
        TransactionEntity,
        TransactionReceiptEntity,
        LogEntity,
      ],
      timezone: '+09:00',
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
