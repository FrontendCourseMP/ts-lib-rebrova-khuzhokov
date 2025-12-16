import type {
  AddFieldParams,
  IFormValidator,
  TFieldConfig,
  TFieldTypes,
  ValidationError,
  Rule,
} from "./types/types";

/**
 * Класс для валидации HTML форм с поддержкой различных типов полей и правил валидации.
 *
 * @example
 * ```typescript
 * const form = document.querySelector('#myForm') as HTMLFormElement;
 * const validator = new FormValidator(form)
 *   .addField('username', 'text', { required: true, minLength: 3 })
 *   .addField('email', 'email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
 *   .addField('age', 'number', { required: true, min: 18, max: 100 });
 *
 * form.addEventListener('submit', (e) => {
 *   e.preventDefault();
 *   if (validator.validate()) {
 *     // Форма валидна
 *   }
 * });
 * ```
 */
export class FormValidator implements IFormValidator {
  #form: HTMLFormElement;
  #fields: Map<string, TFieldConfig>;

  /**
   * Создаёт экземпляр валидатора для указанной формы.
   *
   * @param form - HTML элемент формы для валидации
   */
  constructor(form: HTMLFormElement) {
    this.#form = form;
    this.#form.setAttribute("novalidate", "true");
    this.#fields = new Map();
  }

  /**
   * Добавляет поле для валидации с указанными правилами.
   * Правила из HTML атрибутов (required, minlength, maxlength, pattern, min, max)
   * автоматически извлекаются и объединяются с переданными правилами.
   *
   * @param fieldName - Имя поля (должно соответствовать id элемента input-{fieldName})
   * @param type - Тип поля ('text', 'email', 'password', 'number')
   * @param rules - Опциональные правила валидации для поля
   * @returns Возвращает this для поддержки цепочки вызовов
   *
   * @example
   * ```typescript
   * validator
   *   .addField('username', 'text', { required: true, minLength: 3 })
   *   .addField('email', 'email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });
   * ```
   */
  addField({ fieldName, type, rules }: AddFieldParams): this {
    const htmlRules = this.#extractHtmlRules(fieldName, type);
    const finalRules = this.#mergeRules(htmlRules, rules);

    this.#fields.set(fieldName, {
      fieldName,
      type,
      rules: rules || {},
      htmlRules,
      finalRules,
    });

    return this;
  }

  /**
   * Выполняет валидацию всех добавленных полей формы.
   * При обнаружении ошибок отображает сообщения в соответствующих элементах error-{fieldName}.
   *
   * @returns true если все поля валидны, false если есть ошибки
   *
   * @example
   * ```typescript
   * if (validator.validate()) {
   *   // Все поля валидны, можно отправлять форму
   * } else {
   *   // Есть ошибки валидации
   * }
   * ```
   */
  validate(): boolean {
    this.#clearErrors();

    let isValid = true;

    this.#fields.forEach((config) => {
      const error = this.#validateField(config);
      if (error) {
        isValid = false;
        this.#showError(error.fieldName, error.message);
      }
    });

    return isValid;
  }

  #extractHtmlRules<T extends TFieldTypes>(fieldName: string, type: T): Rule {
    const input = this.#form.querySelector(
      `#input-${fieldName}`
    ) as HTMLInputElement | null;

    if (!input) {
      throw new Error(`Input not found: input-${fieldName}`);
    }

    const rules: Partial<Record<string, unknown>> = {};

    if (input.hasAttribute("required")) {
      rules.required = true;
    }

    if (type !== "number") {
      if (input.hasAttribute("minlength")) {
        rules.minLength = parseInt(input.getAttribute("minlength")!, 10);
      }
      if (input.hasAttribute("maxlength")) {
        rules.maxLength = parseInt(input.getAttribute("maxlength")!, 10);
      }
      if (input.hasAttribute("pattern")) {
        rules.pattern = new RegExp(input.getAttribute("pattern")!);
      }
    }

    if (type === "number") {
      if (input.hasAttribute("min")) {
        rules.min = parseFloat(input.getAttribute("min")!);
      }
      if (input.hasAttribute("max")) {
        rules.max = parseFloat(input.getAttribute("max")!);
      }
    }

    if (type === "checkbox") {
      if (input.hasAttribute("data-checked")) {
        rules.checked = input.getAttribute("data-checked") === "true";
      }
    }

    return rules as Rule;
  }

  #mergeRules(htmlRules: Rule, jsRules?: Rule): Rule {
    return {
      ...htmlRules,
      ...jsRules,
    };
  }

  #validateField(config: TFieldConfig): ValidationError | null {
    const input = this.#form.querySelector(
      `#input-${config.fieldName}`
    ) as HTMLInputElement | null;

    if (!input) {
      return null;
    }

    const value =
      config.type === "checkbox" ? input.checked : input.value.trim();
    const rules = config.finalRules;

    if (rules.required) {
      if (config.type === "checkbox") {
        if (!value) {
          return {
            fieldName: config.fieldName,
            message:
              rules.getMessage?.() ||
              this.#getDefaultErrorMessage("required", rules),
          };
        }
      } else {
        if (!value) {
          return {
            fieldName: config.fieldName,
            message:
              rules.getMessage?.() ||
              this.#getDefaultErrorMessage("required", rules),
          };
        }
      }
    }

    if (config.type !== "checkbox" && !value) {
      return null;
    }

    if (config.type === "number") {
      const numValue = Number(value);
      const numRules = rules as { min?: number; max?: number };

      if (numRules.min !== undefined && numValue < numRules.min) {
        return {
          fieldName: config.fieldName,
          message:
            rules.getMessage?.() || this.#getDefaultErrorMessage("min", rules),
        };
      }

      if (numRules.max !== undefined && numValue > numRules.max) {
        return {
          fieldName: config.fieldName,
          message:
            rules.getMessage?.() || this.#getDefaultErrorMessage("max", rules),
        };
      }
    } else if (config.type !== "checkbox") {
      const strValue = value as string;
      const strRules = rules as {
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
      };

      if (
        strRules.minLength !== undefined &&
        strValue.length < strRules.minLength
      ) {
        return {
          fieldName: config.fieldName,
          message:
            rules.getMessage?.() ||
            this.#getDefaultErrorMessage("minLength", rules),
        };
      }

      if (
        strRules.maxLength !== undefined &&
        strValue.length > strRules.maxLength
      ) {
        return {
          fieldName: config.fieldName,
          message:
            rules.getMessage?.() ||
            this.#getDefaultErrorMessage("maxLength", rules),
        };
      }

      if (strRules.pattern && !strRules.pattern.test(strValue)) {
        return {
          fieldName: config.fieldName,
          message:
            rules.getMessage?.() ||
            this.#getDefaultErrorMessage("pattern", rules),
        };
      }
    } else {
      const checkboxValue = value as boolean;
      const checkboxRules = rules as { checked?: boolean };

      if (
        checkboxRules.checked !== undefined &&
        checkboxValue !== checkboxRules.checked
      ) {
        return {
          fieldName: config.fieldName,
          message:
            rules.getMessage?.() ||
            this.#getDefaultErrorMessage("checked", rules),
        };
      }
    }

    return null;
  }

  #showError(fieldName: string, message: string): void {
    const errorElement = this.#form.querySelector(
      `#error-${fieldName}`
    ) as HTMLElement | null;
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  #clearErrors(): void {
    this.#fields.forEach((_, fieldName) => {
      const errorElement = this.#form.querySelector(
        `#error-${fieldName}`
      ) as HTMLElement | null;
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
      }
    });
  }

  #getDefaultErrorMessage(rule: string, rules: Rule): string {
    const rulesAny = rules as Record<string, unknown>;
    const messages: Record<string, string> = {
      required: "Это поле обязательно",
      minLength: `Минимум ${rulesAny.minLength} символов`,
      maxLength: `Максимум ${rulesAny.maxLength} символов`,
      pattern: "Неверный формат",
      min: `Минимальное значение: ${rulesAny.min}`,
      max: `Максимальное значение: ${rulesAny.max}`,
      checked: `Необходимо отметить чекбокс`,
    };

    return messages[rule] || "Ошибка валидации";
  }
}
