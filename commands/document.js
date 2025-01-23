import { Argument, Option } from "commander";
import { compact } from "lodash-es";
import path from "node:path";

import {
  extractDisclaimerDocument,
  extractFsgtAdultCertificateDocument,
  extractFsgtChildCertificateDocument,
  extractMedicalCertificateDocument,
} from "../lib/extractors/document.extractors.js";
import {
  fetchAndDownloadDocument,
  fetchFormsBySubscriptionYear,
  fetchMembersByForm,
} from "../lib/fetchers.js";
import program, { parseYearOption } from "../lib/program.js";

program
  .command("document")
  .description("Download documents such as certificates and disclaimers")
  .addArgument(
    new Argument("[destination]", "destination directory").default(
      path.join("grimpo6", "document"),
    ),
  )
  .addOption(
    new Option("--subscription-year <value>", "subscription year")
      .argParser(parseYearOption)
      .makeOptionMandatory(),
  )
  .action(async (destination, options) => {
    const forms = await fetchFormsBySubscriptionYear(options.subscriptionYear);

    for (const form of forms) {
      const members = await fetchMembersByForm(form);

      for (const member of members) {
        const documents = compact([
          extractFsgtAdultCertificateDocument(member),
          extractFsgtChildCertificateDocument(member),
          extractMedicalCertificateDocument(member),
          extractDisclaimerDocument(member),
        ]);

        for (const document of documents) {
          await fetchAndDownloadDocument({
            ...document,
            name: path.join(destination, document.name),
          });
        }
      }
    }
  });
