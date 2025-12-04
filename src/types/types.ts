export type TStringFieldTypes = "email" | "password" | "text";

export type TNumberFieldTypes = "number";

export type TFieldTypes = TStringFieldTypes | TNumberFieldTypes;

export type TStringRule = {
  pattern?: RegExp;
  maxLength?: number;
  minLength?: number;
};

export type TNumberRule = {
  max?: number;
  min?: number;
};

export type CommonRule = {
  required?: boolean;
  getMessage?: () => string;
};

export type Rule<T extends TFieldTypes> = Partial<
  (T extends TNumberFieldTypes ? TNumberRule : TStringRule) & CommonRule
>;

export interface IFormValidator {
  addField<T extends TFieldTypes>(
    fieldName: string,
    type: T,
    rules?: Rule<T>
  ): this;
  validate(): boolean;
}
