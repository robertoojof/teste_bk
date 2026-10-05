import { ValidationError } from 'class-validator';
import { flattenValidationErrors } from '../../flatten-validation-errors';

function error(props: Partial<ValidationError>): ValidationError {
  return Object.assign(new ValidationError(), props);
}

describe('flattenValidationErrors unit tests', () => {
  it('should return an empty object when there are no errors', () => {
    expect(flattenValidationErrors([])).toStrictEqual({});
  });

  it('should map the constraints of the root fields', () => {
    const result = flattenValidationErrors([
      error({
        property: 'name',
        constraints: {
          isNotEmpty: 'name should not be empty',
          isString: 'name must be a string',
        },
      }),
    ]);

    expect(result).toStrictEqual({
      name: ['name should not be empty', 'name must be a string'],
    });
  });

  it('should map nested and array errors using the full path', () => {
    const result = flattenValidationErrors([
      error({
        property: 'customer',
        children: [
          error({
            property: 'email',
            constraints: { isEmail: 'email must be an email' },
          }),
        ],
      }),
      error({
        property: 'items',
        constraints: { arrayNotEmpty: 'items should not be empty' },
        children: [
          error({
            property: '0',
            children: [
              error({
                property: 'quantity',
                constraints: { min: 'quantity must not be less than 1' },
              }),
            ],
          }),
        ],
      }),
    ]);

    expect(result).toStrictEqual({
      'customer.email': ['customer.email must be an email'],
      items: ['items should not be empty'],
      'items.0.quantity': ['items.0.quantity must not be less than 1'],
    });
  });
});
