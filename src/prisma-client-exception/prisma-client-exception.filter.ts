//src/prisma-client-exception.filter.ts
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { prismaErrorHandler } from '../utils/errorPrisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    const errorCodes = exception.code || 'default';
    const errors = prismaErrorHandler(errorCodes, message);

    response.status(errors.statusCode).json({
      statusCode: errors.statusCode,
      message: errors.message,
    });
  }
}
