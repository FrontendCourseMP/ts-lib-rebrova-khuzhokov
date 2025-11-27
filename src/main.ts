import { FormValidator } from "./form-validator";

const form = document.querySelector("#form") as HTMLFormElement | null;

if (!form) {
  throw new Error("#form does not exist");
}

const validator = new FormValidator(form);

const ENGLISH_LETTERS_REGEXP = new RegExp("^[a-zA-Z]+$");

validator.addField("username", "text", [
  { minLength: 3, maxLength: 255, pattern: ENGLISH_LETTERS_REGEXP },
]);

validator.addField("age", "number", [{ min: 18, max: 65 }]);

validator.addField("email", "email");

validator.addField("password", "password", [{ minLength: 8 }]);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validator.validate();
});
