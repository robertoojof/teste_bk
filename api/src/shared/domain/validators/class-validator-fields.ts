import { validateSync } from 'class-validator';
import { flattenValidationErrors } from './flatten-validation-errors';
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = {};

  validatedData: PropsValidated = {} as PropsValidated;

  validate(data: unknown): boolean {
    if (typeof data !== 'object' || data === null) {
      this.errors = { data: ['must be a valid object'] };
      return false;
    }

    const errors = validateSync(data);

    if (errors.length) {
      this.errors = flattenValidationErrors(errors);
    } else {
      this.errors = {};
      this.validatedData = data as PropsValidated;
    }

    return !errors.length;
  }
}
