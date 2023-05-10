import { HttpStatus } from '@nestjs/common';
export const prismaErrorHandler = (codeStatus: string, message: string) =>
  errorsCollection(message).find(({ errorCode }) => errorCode === codeStatus);

const errorsCollection = (message: string) => [
  {
    errorCode: 'P2002',
    statusCode: HttpStatus.CONFLICT,
    message,
  },
  {
    errorCode: 'default',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message,
  },
];
