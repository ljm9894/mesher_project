import { Module } from '@nestjs/common';
import { BlockchainModule } from './domain/blockchain/blockchain.module';
import { DatabaseModule } from './db/config/db.module';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from './domain/slack/slack.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { SlackService } from './domain/slack/slack.service';
import { APP_FILTER } from '@nestjs/core';
import { SentryExceptionFilter } from './global/filter/sentry.filter';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    BlockchainModule,
    DatabaseModule,
    SlackModule,
  ],
  controllers: [],
  providers: [
    SlackService,
    {
      provide: APP_FILTER,
      useClass: SentryExceptionFilter,
    },
  ],
})
export class AppModule {}
