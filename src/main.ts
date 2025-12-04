import { FormValidator } from "./form-validator";

const form = document.querySelector("#form") as HTMLFormElement | null;

if (!form) {
  throw new Error("#form does not exist");
}

const validator = new FormValidator(form)
  .addField("username", "text", { required: true, minLength: 3 })
  .addField("email", "email", {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  .addField("password", "password", { required: true, minLength: 8 })
  .addField("age", "number", { required: true, min: 18, max: 100 });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validator.validate();
});
