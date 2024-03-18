import { build } from "./app.js";

("use strict");

const server = build({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

try {
  await server.listen({ port: 3000 });
} catch (error) {
  server.log.error(error);
  process.exit(1); //exit code https://www.geeksforgeeks.org/node-js-exit-codes/
}
