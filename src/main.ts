import { FormValidator } from "./form-validator";

const form = document.querySelector("#form") as HTMLFormElement | null;

if (!form) {
  throw new Error("#form does not exist");
}

const validator = new FormValidator(form)
  .addField({
    fieldName: "username",
    type: "text",
    rules: { required: true, minLength: 3 },
  })
  .addField({
    fieldName: "email",
    type: "email",
    rules: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  })
  .addField({
    fieldName: "password",
    type: "password",
    rules: { required: true, minLength: 8 },
  })
  .addField({
    fieldName: "age",
    type: "number",
    rules: { required: true, min: 18, max: 100 },
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validator.validate();
});
