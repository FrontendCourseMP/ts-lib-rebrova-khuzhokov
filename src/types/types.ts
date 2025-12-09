export type TStringFieldTypes = "email" | "password" | "text";

export type TNumberFieldTypes = "number";

export type TCheckboxFieldTypes = "checkbox";

export type TFieldTypes = TStringFieldTypes | TNumberFieldTypes | TCheckboxFieldTypes;

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

export type TCheckboxRule = {
  required?: boolean;
  checked?: boolean;
};

type FinalNumberRules = Partial<TNumberRule & CommonRule>;

type FinalStringRules = Partial<TStringRule & CommonRule>;

type FinalCheckboxRules = Partial<TCheckboxRule & CommonRule>;

export type Rule = FinalNumberRules | FinalStringRules | FinalCheckboxRules;

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
    }
  | {
      fieldName: string;
      type: TCheckboxFieldTypes;
      rules?: FinalCheckboxRules;
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
    }
  | {
      fieldName: string;
      type: TCheckboxFieldTypes;
      rules: FinalCheckboxRules;
      htmlRules: FinalCheckboxRules;
      finalRules: FinalCheckboxRules;
    };

export type ValidationError = {
  fieldName: string;
  message: string;
};
