import { FormData } from "formdata-node";
import got from "got";

import program from "./program.js";

const api = got.extend({
  prefixUrl: "https://api.helloasso.com",
  responseType: "json",
  resolveBodyOnly: true,
});

let accessToken;
let refreshToken;

const client = api.extend({
  hooks: {
    beforeRequest: [
      async (options) => {
        if (!accessToken) {
          const { clientId, clientSecret } = program.opts();

          const formData = new FormData();

          formData.append("client_id", clientId);
          formData.append("client_secret", clientSecret);
          formData.append("grant_type", "client_credentials");

          const payload = await api.post("oauth2/token", {
            body: formData,
          });

          accessToken = payload.access_token;
          refreshToken = payload.refresh_token;
        }

        options.headers.authorization = `Bearer ${accessToken}`;
      },
    ],
    afterResponse: [
      async (response, retryWithMergedOptions) => {
        if (response.statusCode === 401 && refreshToken) {
          const formData = new FormData();

          formData.append("refresh_token", refreshToken);
          formData.append("grant_type", "refresh_token");

          const payload = await api.post("oauth2/token", {
            body: formData,
          });

          accessToken = payload.access_token;
          refreshToken = payload.refresh_token;

          return retryWithMergedOptions({});
        }

        return response;
      },
    ],
  },
});

export default client;
