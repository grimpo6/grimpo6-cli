import {
  AUTONOMOUS_CHILDREN_PARENTS,
  FRIDAY_CHILDREN_PARENTS,
  TUESDAY_CHILDREN_PARENTS,
} from "../constants/mailing.constants.js";

export function extractChildrenSlot(form) {
  const title = form.title.toLowerCase();

  if (title.includes("enfant")) {
    if (title.includes("mardi")) {
      return TUESDAY_CHILDREN_PARENTS;
    }

    if (title.includes("vendredi")) {
      return FRIDAY_CHILDREN_PARENTS;
    }

    return AUTONOMOUS_CHILDREN_PARENTS;
  }
}
