import filenamify from "filenamify";
import validator from "validator";

function extractDocument(member, predicate, name) {
  const customField = member.customFields.find(
    (field) => field.type === "File" && predicate(field),
  );

  if (customField && validator.isURL(customField.answer)) {
    const { firstName, lastName } = member.user;

    return {
      url: customField.answer,
      name: filenamify(`${firstName.trim()} ${lastName.trim()} - ${name}`),
    };
  }
}

export function extractFsgtAdultCertificateDocument(member) {
  return extractDocument(
    member,
    (field) => field.name.includes("FSGT majeur"),
    "Attestation FSGT majeur",
  );
}

export function extractFsgtChildCertificateDocument(member) {
  return extractDocument(
    member,
    (field) => field.name.includes("FSGT mineur"),
    "Attestation FSGT mineur",
  );
}

export function extractMedicalCertificateDocument(member) {
  return extractDocument(
    member,
    (field) => field.name.startsWith("Certificat"),
    "Certificat médical",
  );
}

export function extractDisclaimerDocument(member) {
  return extractDocument(
    member,
    (field) => field.name.startsWith("Décharge"),
    "Décharge",
  );
}
