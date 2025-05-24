import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  message?: string | string[];

  [key: string]: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const errorResponse: ErrorResponse =
      typeof rawResponse === 'object' && rawResponse !== null
        ? (rawResponse as ErrorResponse)
        : { message: rawResponse };

    const message = this.extractMessage(errorResponse);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private extractMessage(response: ErrorResponse): string | string[] {
    if (Array.isArray(response.message)) return [...response.message];
    if (typeof response.message === 'string') return response.message;
    return 'Unexpected error';
  }
}
