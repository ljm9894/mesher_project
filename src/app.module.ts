import { Module } from '@nestjs/common';
import { BlockchainModule } from './domain/blockchain/blockchain.module';
import { DatabaseModule } from './db/config/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    BlockchainModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
