import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { BlockChainService } from '../blockchain/blockchain.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockCount } from './dto/block.dto';

@Injectable()
export class SlackService {
  private slackClient: WebClient;
  private readonly logger = new Logger();
  constructor(
    private readonly configService: ConfigService,
    private readonly blockChainService: BlockChainService,
  ) {
    const slackToken = process.env.SLACK_BOT_TOKEN;
    this.slackClient = new WebClient(slackToken);
  }
  @Cron('*/5 * * * *')
  async sendBlockCountMessage(): Promise<void> {
    const blockData: BlockCount =
      await this.blockChainService.getBlockChainDataToCount();
    const channelId = this.configService.get<string>('SLACK_CANNEL_ID');
    this.logger.log(`Channel ID : ${channelId}`);
    try {
      await this.slackClient.chat.postMessage({
        channel: channelId,
        text: `\`\`\`
현재 Block 개수: ${blockData.block}
현재 Receipt 개수: ${blockData.receipt}
현재 log 개수: ${blockData.log}
\`\`\``,
      });
      this.logger.log(`Successfully send block count`);
    } catch (err) {
      this.logger.error('Error sending message to slack', err);
    }
  }

  async sendErrorReportToSlack(error: any): Promise<void> {
    const channelId = this.configService.get<string>('SLACK_CANNEL_ID');
    try {
      await this.slackClient.chat.postMessage({
        channel: channelId,
        text: `\`\`\`🚨에러 발생🚨\nError occurred: ${error.message}\nStack Trace: ${error.stack}\`\`\``,
      });
      this.logger.log('Successfully sent error report to Slack');
    } catch (err) {
      this.logger.error('Failed to send error report to Slack', err);
    }
  }
  @Cron('0 * * * *')
  async sendHealthCheckMessage(): Promise<void> {
    const channelId = this.configService.get<string>('SLACK_CANNEL_ID');
    try {
      await this.slackClient.chat.postMessage({
        channel: channelId,
        text: '✅ 서버가 정상 작동하고 있습니다.',
      });
      this.logger.log('Health check message sent to Slack.');
    } catch (err) {
      this.logger.error('Error sending health check message to Slack:', err);
    }
  }
}
