import * as https from "https";
import { RequestHandler, Response } from "../types";
import { serializeRequestBody } from "../utility/serializeRequestBody";

const nodeHttps: RequestHandler = (
  url: string,
  { method = "GET", headers = {}, body = "" } = {},
): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    // prep request body
    if (body) {
      body = serializeRequestBody(body);
    }

    if (body.length) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      headers["Content-Length"] = body.length;
    }

    // send request
    const req = https.request(
      url,
      {
        method,
        headers,
      },
      (response) => {
        let body = "";

        response.on("data", function (chunk) {
          body += chunk;
        });

        response.on("end", function () {
          const data = JSON.parse(body);

          resolve({
            status: response.statusCode,
            headers: response.headers,
            data,
          });
        });
      },
    );

    req.on("error", reject);

    if (body.length) {
      req.write(body);
    }
    req.end();
  });
};

export { nodeHttps as nodeHttpsRequestHandler };
