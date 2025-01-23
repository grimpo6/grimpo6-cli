import { Command, InvalidArgumentError, Option } from "commander";
import validator from "validator";

const program = new Command()
  .name("grimpo6")
  .description("CLI to do stuff related to Grimpo6 association")
  .addOption(
    new Option("--client-id <value>", "client ID for HelloAsso API")
      .env("CLIENT_ID")
      .makeOptionMandatory(),
  )
  .addOption(
    new Option("--client-secret <value>", "client secret for HelloAsso API")
      .env("CLIENT_SECRET")
      .makeOptionMandatory(),
  );

export default program;

export function parseYearOption(value) {
  if (/^\d{4}$/.test(value)) {
    const year = Number(value);

    return year;
  }

  throw new InvalidArgumentError("Enter a valid year like 2024");
}

export function parseEmailsOption(value, emails = []) {
  if (validator.isEmail(value)) {
    const email = validator.normalizeEmail(value);

    return [...emails, email];
  }

  throw new InvalidArgumentError("Enter a valid email like john@example.com");
}
