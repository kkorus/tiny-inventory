import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export type FieldValidationError = {
  readonly field: string;
  readonly messages: readonly string[];
};

export type ValidationErrorResponse = {
  readonly statusCode: 400;
  readonly message: 'Validation failed';
  readonly errors: readonly FieldValidationError[];
};

function flattenErrors(
  errors: ValidationError[],
  parentField = '',
): FieldValidationError[] {
  return errors.flatMap((e) => {
    const field = parentField ? `${parentField}.${e.property}` : e.property;
    const messages = Object.values(e.constraints ?? {});
    const childErrors = e.children?.length
      ? flattenErrors(e.children, field)
      : [];
    return messages.length
      ? [{ field, messages }, ...childErrors]
      : childErrors;
  });
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors): BadRequestException => {
      const body: ValidationErrorResponse = {
        statusCode: 400,
        message: 'Validation failed',
        errors: flattenErrors(errors),
      };
      return new BadRequestException(body);
    },
  });
}
