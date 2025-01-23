import { Argument, Option } from "commander";
import { compact, uniq } from "lodash-es";
import os from "node:os";
import path from "node:path";

import {
  extractAdultEmail,
  extractFirstParentEmail,
  extractSecondParentEmail,
} from "../lib/extractors/email.extractors.js";
import { extractChildrenSlot } from "../lib/extractors/subscription.extractors.js";
import {
  extractFirstPole,
  extractSecondPole,
  extractTrailPole,
} from "../lib/extractors/pole.extractors.js";
import {
  fetchFormsBySubscriptionYear,
  fetchMembersByForm,
} from "../lib/fetchers.js";
import { writeFile } from "../lib/utils.js";
import * as mailingRecord from "../lib/constants/mailing.constants.js";
import program, { parseYearOption, parseEmailsOption } from "../lib/program.js";

program
  .command("mailing")
  .description("Generate mailing lists for OVHcloud")
  .addArgument(
    new Argument("[destination]", "destination directory").default(
      path.join("grimpo6", "mailing"),
    ),
  )
  .addOption(
    new Option("--subscription-year <value>", "subscription year")
      .argParser(parseYearOption)
      .makeOptionMandatory(),
  )
  .addOption(
    new Option("--president-emails <values...>", "president emails list")
      .argParser(parseEmailsOption)
      .makeOptionMandatory(),
  )
  .action(async (destination, options) => {
    const entries = [];
    const forms = await fetchFormsBySubscriptionYear(options.subscriptionYear);

    for (const form of forms) {
      const members = await fetchMembersByForm(form);
      const childrenSlot = extractChildrenSlot(form);

      for (const member of members) {
        if (childrenSlot) {
          entries.push({
            emails: [
              extractFirstParentEmail(member),
              extractSecondParentEmail(member),
            ],
            mailingLists: [
              mailingRecord.MEMBERS,
              mailingRecord.PARENTS,
              childrenSlot,
              extractFirstPole(member),
              extractSecondPole(member),
            ],
          });
        } else {
          entries.push({
            emails: [extractAdultEmail(member)],
            mailingLists: [
              mailingRecord.MEMBERS,
              extractFirstPole(member),
              extractSecondPole(member),
              extractTrailPole(member),
            ],
          });
        }
      }
    }

    for (const mailingList of Object.values(mailingRecord)) {
      const matchedEmails = compact(
        entries
          .filter((entry) => entry.mailingLists.includes(mailingList))
          .flatMap((entry) => entry.emails),
      );

      const mailingListEmails = uniq([
        ...options.presidentEmails,
        ...matchedEmails,
      ]);

      const filename = path.format({
        dir: destination,
        name: mailingList,
        ext: "txt",
      });

      const data = mailingListEmails.sort().join(os.EOL);

      await writeFile(filename, data);
    }
  });
