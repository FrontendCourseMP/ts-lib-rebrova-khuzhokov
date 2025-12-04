import { describe, it, expect, beforeEach } from "vitest";
import { FormValidator } from "../form-validator";

describe("FormValidator", () => {
  describe("Конструктор", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form"></form>
      `;
    });

    it("должен создать валидатор с валидным селектором формы", () => {
      const form = document.getElementById("test-form") as HTMLFormElement;
      const validator = new FormValidator(form);
      expect(validator).toBeInstanceOf(FormValidator);
    });

    it("должен создать валидатор даже с null (проверка происходит при addField)", () => {
      // Конструктор не проверяет валидность формы, проверка происходит при добавлении полей
      expect(() => {
        new FormValidator(null as unknown as HTMLFormElement);
      }).not.toThrow();
    });
  });

  describe("addField", () => {
    let validator: FormValidator;

    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form">
          <div id="username">
            <input type="text" id="input-username" />
            <span id="error-username"></span>
          </div>
          <div id="age">
            <input type="number" id="input-age" />
            <span id="error-age"></span>
          </div>
        </form>
      `;
      const form = document.getElementById("test-form") as HTMLFormElement;
      validator = new FormValidator(form);
    });

    it("должен добавить текстовое поле", () => {
      expect(() => {
        validator.addField("username", "text");
      }).not.toThrow();
    });

    it("должен добавить числовое поле", () => {
      expect(() => {
        validator.addField("age", "number");
      }).not.toThrow();
    });

    it("должен поддерживать цепочку вызовов addField", () => {
      const result = validator
        .addField("username", "text")
        .addField("age", "number");
      expect(result).toBe(validator);
    });

    it("должен выбросить ошибку при несуществующем поле", () => {
      expect(() => {
        validator.addField("nonexistent", "text");
      }).toThrow("Input not found: input-nonexistent");
    });
  });

  describe("validate - строковые поля", () => {
    let validator: FormValidator;

    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form">
          <div id="username">
            <input type="text" id="input-username" />
            <span id="error-username"></span>
          </div>
        </form>
      `;
      const form = document.getElementById("test-form") as HTMLFormElement;
      validator = new FormValidator(form);
    });

    describe("required", () => {
      it("должен вернуть false для пустого обязательного поля", () => {
        validator.addField("username", "text", { required: true });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });

      it("должен вернуть true для заполненного обязательного поля", () => {
        validator.addField("username", "text", { required: true });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "John";

        const isValid = validator.validate();
        expect(isValid).toBe(true);
      });
    });

    describe("minLength", () => {
      it("должен вернуть false для слишком короткого значения", () => {
        validator.addField("username", "text", { minLength: 5 });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "John";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });

      it("должен вернуть true для значения достаточной длины", () => {
        validator.addField("username", "text", { minLength: 5 });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "Johnny";

        const isValid = validator.validate();
        expect(isValid).toBe(true);
      });
    });

    describe("maxLength", () => {
      it("должен вернуть false для слишком длинного значения", () => {
        validator.addField("username", "text", { maxLength: 5 });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "Johnny";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });

      it("должен вернуть true для значения допустимой длины", () => {
        validator.addField("username", "text", { maxLength: 5 });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "John";

        const isValid = validator.validate();
        expect(isValid).toBe(true);
      });
    });

    describe("pattern", () => {
      it("должен вернуть false для значения не соответствующего паттерну", () => {
        validator.addField("username", "text", { pattern: /^[a-z]+$/ });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "John123";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });

      it("должен вернуть true для значения соответствующего паттерну", () => {
        validator.addField("username", "text", { pattern: /^[a-z]+$/ });
        const input = document.getElementById(
          "input-username"
        ) as HTMLInputElement;
        input.value = "john";

        const isValid = validator.validate();
        expect(isValid).toBe(true);
      });
    });
  });

  describe("validate - числовые поля", () => {
    let validator: FormValidator;

    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form">
          <div id="age">
            <input type="number" id="input-age" />
            <span id="error-age"></span>
          </div>
        </form>
      `;
      const form = document.getElementById("test-form") as HTMLFormElement;
      validator = new FormValidator(form);
    });

    describe("required", () => {
      it("должен вернуть false для пустого обязательного поля", () => {
        validator.addField("age", "number", { required: true });
        const input = document.getElementById("input-age") as HTMLInputElement;
        input.value = "";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });
    });

    describe("min", () => {
      it("должен вернуть false для значения меньше минимума", () => {
        validator.addField("age", "number", { min: 18 });
        const input = document.getElementById("input-age") as HTMLInputElement;
        input.value = "15";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });

      it("должен вернуть true для значения больше или равного минимуму", () => {
        validator.addField("age", "number", { min: 18 });
        const input = document.getElementById("input-age") as HTMLInputElement;
        input.value = "18";

        const isValid = validator.validate();
        expect(isValid).toBe(true);
      });
    });

    describe("max", () => {
      it("должен вернуть false для значения больше максимума", () => {
        validator.addField("age", "number", { max: 100 });
        const input = document.getElementById("input-age") as HTMLInputElement;
        input.value = "150";

        const isValid = validator.validate();
        expect(isValid).toBe(false);
      });

      it("должен вернуть true для значения меньше или равного максимуму", () => {
        validator.addField("age", "number", { max: 100 });
        const input = document.getElementById("input-age") as HTMLInputElement;
        input.value = "100";

        const isValid = validator.validate();
        expect(isValid).toBe(true);
      });
    });
  });

  describe("Отображение ошибок", () => {
    let validator: FormValidator;

    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form">
          <div id="username">
            <input type="text" id="input-username" />
            <span id="error-username"></span>
          </div>
        </form>
      `;
      const form = document.getElementById("test-form") as HTMLFormElement;
      validator = new FormValidator(form);
    });

    it("должен отобразить ошибку в правильном элементе", () => {
      validator.addField("username", "text", { required: true });
      const input = document.getElementById(
        "input-username"
      ) as HTMLInputElement;
      input.value = "";

      validator.validate();

      const errorElement = document.getElementById("error-username");
      expect(errorElement?.textContent).toBe("Это поле обязательно");
      expect(errorElement?.style.display).toBe("block");
    });

    it("должен очистить ошибки при повторной валидации", () => {
      validator.addField("username", "text", { required: true });
      const input = document.getElementById(
        "input-username"
      ) as HTMLInputElement;
      input.value = "";

      validator.validate();
      const errorElement = document.getElementById("error-username");
      expect(errorElement?.textContent).toBe("Это поле обязательно");

      input.value = "John";
      validator.validate();
      expect(errorElement?.textContent).toBe("");
      expect(errorElement?.style.display).toBe("none");
    });

    it("должен использовать кастомное сообщение через getMessage", () => {
      validator.addField("username", "text", {
        required: true,
        getMessage: () => "Пожалуйста, введите имя пользователя",
      });
      const input = document.getElementById(
        "input-username"
      ) as HTMLInputElement;
      input.value = "";

      validator.validate();

      const errorElement = document.getElementById("error-username");
      expect(errorElement?.textContent).toBe(
        "Пожалуйста, введите имя пользователя"
      );
    });
  });

  describe("Комплексная валидация", () => {
    let validator: FormValidator;

    beforeEach(() => {
      document.body.innerHTML = `
        <form id="test-form">
          <div id="username">
            <input type="text" id="input-username" />
            <span id="error-username"></span>
          </div>
          <div id="email">
            <input type="email" id="input-email" />
            <span id="error-email"></span>
          </div>
          <div id="age">
            <input type="number" id="input-age" />
            <span id="error-age"></span>
          </div>
        </form>
      `;
      const form = document.getElementById("test-form") as HTMLFormElement;
      validator = new FormValidator(form);
    });

    it("должен валидировать форму с несколькими полями", () => {
      validator
        .addField("username", "text", { required: true, minLength: 3 })
        .addField("email", "email", {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })
        .addField("age", "number", { required: true, min: 18, max: 100 });

      const usernameInput = document.getElementById(
        "input-username"
      ) as HTMLInputElement;
      const emailInput = document.getElementById(
        "input-email"
      ) as HTMLInputElement;
      const ageInput = document.getElementById("input-age") as HTMLInputElement;

      usernameInput.value = "John";
      emailInput.value = "john@example.com";
      ageInput.value = "25";

      const isValid = validator.validate();
      expect(isValid).toBe(true);
    });

    it("должен вернуть true когда все поля валидны", () => {
      validator
        .addField("username", "text", { required: true })
        .addField("email", "email", { required: true })
        .addField("age", "number", { required: true });

      const usernameInput = document.getElementById(
        "input-username"
      ) as HTMLInputElement;
      const emailInput = document.getElementById(
        "input-email"
      ) as HTMLInputElement;
      const ageInput = document.getElementById("input-age") as HTMLInputElement;

      usernameInput.value = "John";
      emailInput.value = "john@example.com";
      ageInput.value = "25";

      const isValid = validator.validate();
      expect(isValid).toBe(true);
    });

    it("должен вернуть false когда есть ошибки", () => {
      validator
        .addField("username", "text", { required: true, minLength: 5 })
        .addField("email", "email", { required: true })
        .addField("age", "number", { min: 18 });

      const usernameInput = document.getElementById(
        "input-username"
      ) as HTMLInputElement;
      const emailInput = document.getElementById(
        "input-email"
      ) as HTMLInputElement;
      const ageInput = document.getElementById("input-age") as HTMLInputElement;

      usernameInput.value = "Jo"; // слишком короткое
      emailInput.value = ""; // пустое
      ageInput.value = "15"; // меньше минимума

      const isValid = validator.validate();
      expect(isValid).toBe(false);

      const usernameError = document.getElementById("error-username");
      const emailError = document.getElementById("error-email");
      const ageError = document.getElementById("error-age");

      expect(usernameError?.textContent).toBe("Минимум 5 символов");
      expect(emailError?.textContent).toBe("Это поле обязательно");
      expect(ageError?.textContent).toBe("Минимальное значение: 18");
    });
  });
});
