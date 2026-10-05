import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
    });
  }
}
