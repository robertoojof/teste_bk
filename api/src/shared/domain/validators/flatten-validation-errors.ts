import { ValidationError } from 'class-validator';
import { FieldsErrors } from './validator-fields.interface';

export function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): FieldsErrors {
  const result: FieldsErrors = {};

  for (const error of errors) {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      result[path] = Object.values(error.constraints).map(message =>
        parentPath ? `${parentPath}.${message}` : message,
      );
    }

    if (error.children?.length) {
      Object.assign(result, flattenValidationErrors(error.children, path));
    }
  }

  return result;
}
