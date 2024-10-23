import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlockChainService } from './blockchain.service';
import { ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/global/response/base.response';
import { ReasonPhrases } from 'http-status-codes';
import { BlockEntity } from './domain/blockchain.entity';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockChainController {
  constructor(private readonly blockchainService: BlockChainService) {}
  @Post('sync')
  async startSync(): Promise<BaseResponse<boolean>> {
    await this.blockchainService.startBlockSync();
    return new BaseResponse<boolean>(
      HttpStatus.CREATED,
      'block sync start',
      true,
    );
  }

  @Get('/block/:id')
  async findBlock(
    @Param('id') blockHash: string,
  ): Promise<BaseResponse<BlockEntity>> {
    const block = await this.blockchainService.blockRead(blockHash);
    return new BaseResponse<BlockEntity>(
      HttpStatus.OK,
      ReasonPhrases.OK,
      block,
    );
  }
  @Get('/receipt/:id')
  async findReceiptByHash(
    @Param('id') transactionHash: string,
  ): Promise<BaseResponse<any>> {
    const receipt = await this.blockchainService.receiptRead(transactionHash);
    return new BaseResponse<any>(HttpStatus.OK, ReasonPhrases.OK, receipt);
  }

  @Get('/receipt')
  async findReceiptByFromOrTo(
    @Query('option') option: string,
    @Query('address') address: string,
  ): Promise<BaseResponse<any>> {
    const result = await this.blockchainService.findReceiptByFromOrTo(
      option,
      address,
    );
    return new BaseResponse<any>(HttpStatus.OK, ReasonPhrases.OK, result);
  }
}
