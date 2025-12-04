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

type FinalNumberRules = Partial<TNumberRule & CommonRule>;

type FinalStringRules = Partial<TStringRule & CommonRule>;

export type Rule = FinalNumberRules | FinalStringRules;

export type AddFieldParams =
  | {
      fieldName: string;
      type: TStringFieldTypes;
      rules?: FinalStringRules;
    }
  | {
      fieldName: string;
      type: TNumberFieldTypes;
      rules?: FinalNumberRules;
    };

export interface IFormValidator {
  addField(params: AddFieldParams): this;
  validate(): boolean;
}
export type TFieldConfig =
  | {
      fieldName: string;
      type: TStringFieldTypes;
      rules: FinalStringRules;
      htmlRules: FinalStringRules;
      finalRules: FinalStringRules;
    }
  | {
      fieldName: string;
      type: TNumberFieldTypes;
      rules: FinalNumberRules;
      htmlRules: FinalNumberRules;
      finalRules: FinalNumberRules;
    };

export type ValidationError = {
  fieldName: string;
  message: string;
};
