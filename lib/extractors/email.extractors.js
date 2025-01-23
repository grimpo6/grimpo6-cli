import validator from "validator";

function extractEmail(member, predicate) {
  const customField = member.customFields.find(
    (field) => field.type === "TextInput" && predicate(field),
  );

  if (customField && validator.isEmail(customField.answer)) {
    return validator.normalizeEmail(customField.answer);
  }
}

export function extractAdultEmail(member) {
  return extractEmail(member, (field) => field.name.startsWith("Email -"));
}

export function extractFirstParentEmail(member) {
  return extractEmail(member, (field) =>
    field.name.startsWith("Email du parent -"),
  );
}

export function extractSecondParentEmail(member) {
  return extractEmail(member, (field) =>
    field.name.startsWith("Email du parent 2"),
  );
}
