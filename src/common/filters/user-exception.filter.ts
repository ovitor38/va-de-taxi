import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

interface ExceptionWithCode {
  code: string;
}

@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMapping: Record<string, [number, string]> = {
      UnauthorizedException: [401, 'Access denied'],
      NotFoundException: [404, 'Resource not found'],
      P2002: [403, 'Email already in use'],
      P2025: [404, 'User not found'],
    };

    let status = 500;
    let message = 'Internal Server Error';

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof NotFoundException
    ) {
      status = exception.getStatus();
      message =
        typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as any).message || message;
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception
    ) {
      const code = (exception as ExceptionWithCode).code;
      [status, message] = statusMapping[code] || [500, message];
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
