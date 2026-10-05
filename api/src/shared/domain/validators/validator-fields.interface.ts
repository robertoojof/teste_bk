export type FieldsErrors = {
  [field: string]: string[];
};

export type ValidatorFieldsInterface<PropsValidated> = {
  errors: FieldsErrors;
  validatedData: PropsValidated | null;
  validate(data: unknown): boolean;
};
