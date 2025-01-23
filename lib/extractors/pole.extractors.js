import {
  CHILDREN_MENTORING_POLE,
  CLIMBING_FOR_EVERYONE_POLE,
  CLIMBING_WALL_POLE,
  COMMUNICATION_POLE,
  EQUIPMENT_POLE,
  EVENT_POLE,
  IT_POLE,
  MEMBERSHIP_POLE,
  OUTING_POLE,
  TRAIL_POLE,
  TRAINING_POLE,
} from "../constants/mailing.constants.js";

function extractPole(member, predicate) {
  const customField = member.customFields.find(
    (field) => field.type === "ChoiceList" && predicate(field),
  );

  if (customField) {
    switch (customField.answer) {
      case "Accueil - autonomie des nouveaux et formation":
      case "Accueil - autonomie des nouveaux et formations":
        return TRAINING_POLE;
      case "Adhésion":
        return MEMBERSHIP_POLE;
      case "Communication":
        return COMMUNICATION_POLE;
      case "Encadrement des enfants le mardi":
      case "Encadrement des enfants le Vendredi":
      case "Encadrements Enfants":
      case "Enfants":
        return CHILDREN_MENTORING_POLE;
      case "Escalade pour tous":
        return CLIMBING_FOR_EVERYONE_POLE;
      case "Évènements":
        return EVENT_POLE;
      case "Informatique":
        return IT_POLE;
      case "Matériel":
        return EQUIPMENT_POLE;
      case "SAE - Vie du mur":
        return CLIMBING_WALL_POLE;
      case "Sorties":
        return OUTING_POLE;
      case "Trail":
        return TRAIL_POLE;
    }
  }
}

export function extractFirstPole(member) {
  return extractPole(
    member,
    (field) =>
      field.name.startsWith("Pôle n°1") || field.name.startsWith("1er Pôle"),
  );
}

export function extractSecondPole(member) {
  return extractPole(
    member,
    (field) =>
      field.name.startsWith("Pôle n°2") || field.name.startsWith("2nd Pôle"),
  );
}

export function extractTrailPole(member) {
  const customField = member.customFields.find(
    (field) =>
      field.type === "YesNo" &&
      field.name.startsWith("Vous souhaitez relancer le pôle Trail"),
  );

  if (customField?.answer === "Oui") {
    return TRAIL_POLE;
  }
}
