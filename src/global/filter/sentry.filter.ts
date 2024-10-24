import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { SlackService } from 'src/domain/slack/slack.service';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  constructor(private readonly slackService: SlackService) {}
  @Sentry.WithSentry()
  async catch(exception: HttpException, host: ArgumentsHost) {
    Sentry.captureException(exception);

    await this.slackService.sendErrorReportToSlack(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
