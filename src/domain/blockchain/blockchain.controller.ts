import { Controller, Post } from '@nestjs/common';
import { BlockChainService } from './blockchain.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockChainController {
  constructor(private readonly blockchainService: BlockChainService) {}
  @Post('sync')
  async startSync() {
    await this.blockchainService.startBlockSync();
    return { message: 'Block sync started' };
  }
}
