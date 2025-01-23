import { isAfter, isBefore } from "date-fns";
import mime from "mime-types";
import path from "node:path";

import { writeFile } from "./utils.js";
import client from "./client.js";

function fetchWithPagination(url, options) {
  return client.paginate.all(url, {
    ...options,
    searchParams: {
      ...options?.searchParams,
      pageSize: 100, // Maximum page size authorized
    },
    pagination: {
      ...options?.pagination,
      paginate: ({ response, currentItems }) => {
        if (currentItems.length === 0) {
          return false;
        }

        return {
          searchParams: {
            continuationToken: response.body.pagination.continuationToken,
          },
        };
      },
      transform: (response) => response.body.data,
    },
  });
}

export async function fetchFormsBySubscriptionYear(subscriptionYear) {
  const forms = await fetchWithPagination("v5/organizations/grimpo6/forms", {
    searchParams: {
      formTypes: "Membership",
    },
  });

  const startDate = new Date(`${subscriptionYear}-05`);
  const endDate = new Date(`${subscriptionYear + 1}-10`);

  return forms.filter((form) => {
    if (isBefore(form.startDate, startDate)) {
      return false;
    }

    if (isAfter(form.endDate, endDate)) {
      return false;
    }

    return true;
  });
}

export async function fetchMembersByForm(form) {
  const orders = await fetchWithPagination(
    `v5/organizations/grimpo6/forms/Membership/${form.formSlug}/orders`,
    {
      searchParams: {
        withDetails: "true",
      },
    },
  );

  const members = orders
    .flatMap((order) => order.items)
    .filter((item) => item.type === "Membership");

  return members;
}

export async function fetchAndDownloadDocument(document) {
  const { headers, body } = await client.get(document.url, {
    prefixUrl: "",
    responseType: "buffer",
    resolveBodyOnly: false,
  });

  const extension = mime.extension(headers["content-type"]);

  const filename = path.format({
    name: document.name,
    ext: extension,
  });

  await writeFile(filename, body);
}
