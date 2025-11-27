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
    this.#fieldNames = new Set();
    this.#inferDefaultFieldRules();
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
    this.#fieldNames.add(fieldName);
  }

  validate(): boolean {
    throw new Error("Method not implemented.");
  }

  #inferDefaultFieldRules() {
    Array.from(this.#form.children).forEach((child) => {
      if (!this.#fieldNames.has(child.id)) {
        return;
      }
      console.log(child);
    });
  }

  #form: HTMLFormElement;

  #stringFields: Field<TStringFieldTypes>[];

  #numberFields: Field<TNumberFieldTypes>[];

  #stringFieldsDefault: Field<TStringFieldTypes>[];
  #numberFieldsDefault: Field<TNumberFieldTypes>[];
  #fieldNames: Set<string>;
}
