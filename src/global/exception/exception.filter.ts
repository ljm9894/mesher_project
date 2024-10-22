import {
  Catch,
  ExecutionContext,
  ExceptionFilter as ex,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseResponse } from '../response/base.response';

@Catch()
export class ExceptionFilter implements ex {
  catch(exception: unknown, host: ExecutionContext) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = (errorResponse as any).message || message;
        error = (errorResponse as any).error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response
      .status(status)
      .json(new BaseResponse<string>(HttpStatus.OK, message, error));
  }
}
