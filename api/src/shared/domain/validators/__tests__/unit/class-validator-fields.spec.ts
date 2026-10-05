import * as libClassValidator from 'class-validator';
import { vi } from 'vitest';
import { ClassValidatorFields } from '../../class-validator-fields';

class StubValidatorFields extends ClassValidatorFields<{ field: string }> {}

describe('ValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData variables with correct values', () => {
    const sut = new StubValidatorFields();

    expect(sut.errors).toMatchObject({});
    expect(sut.validatedData).toMatchObject({});
  });

  it('should validate with errors', () => {
    const spyValidateSync = vi
      .spyOn(libClassValidator, 'validateSync')
      .mockReturnValue([
        { property: 'field', constraints: { isRequired: 'test error' } },
      ] as libClassValidator.ValidationError[]);

    const sut = new StubValidatorFields();

    expect(sut.validate({})).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toMatchObject({});
    expect(sut.errors).toStrictEqual({ field: ['test error'] });
  });

  it('should validate without errors', () => {
    const spyValidateSync = vi
      .spyOn(libClassValidator, 'validateSync')
      .mockReturnValue([] as libClassValidator.ValidationError[]);

    const sut = new StubValidatorFields();

    expect(sut.validate({ field: 'value' })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual({ field: 'value' });
    expect(sut.errors).toMatchObject({});
  });
});
