import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectService } from './db.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MysqlConnectService,
    }),
  ],
})
export class DatabaseModule {}
