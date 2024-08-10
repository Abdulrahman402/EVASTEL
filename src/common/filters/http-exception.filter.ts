import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === 'production';

    console.error(exception);

    let errMessage;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errMessage = 'Internal server error';
    } else if (!isProduction && exception instanceof Error) {
      errMessage = exception['response']?.message || exception.message || null;
    } else {
      errMessage =
        exception['response']?.message || 'An unexpected error occurred';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errMessage,
    };

    response.status(status).json(errorResponse);
  }
}
