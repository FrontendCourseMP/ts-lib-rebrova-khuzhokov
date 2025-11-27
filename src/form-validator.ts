import type {
  IFormValidator,
  Options,
  Rule,
  TFieldTypes,
  TNumberFieldTypes,
  TStringFieldTypes,
} from "./types/types";

type Field<T extends TFieldTypes> = {
  fieldName: string;
  type: T;
  rules: Rule<T>[];
  options: Options;
};

export class FormValidator implements IFormValidator {
  constructor(form: HTMLFormElement) {
    this.#form = form;
    this.#stringFields = [];
    this.#numberFields = [];
  }

  addField<T extends TFieldTypes>(
    fieldName: string,
    type: T,
    rules: Rule<T>[] = [],
    options: Options = {}
  ): void {
    switch (type) {
      case "email":
      case "password":
      case "text":
        this.#stringFields.push({
          fieldName,
          type,
          rules,
          options,
        });
        break;
      case "number":
        this.#numberFields.push({
          fieldName,
          type,
          rules,
          options,
        });
        break;
    }
  }

  validate(): boolean {
    throw new Error("Method not implemented.");
  }

  #inferDefaultFieldRules(fieldName: string) {}

  #form: HTMLFormElement;

  #stringFields: Field<TStringFieldTypes>[];

  #numberFields: Field<TNumberFieldTypes>[];
}
