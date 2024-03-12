import fastify from "fastify";
import fs from "fs/promises";
import { writeFile } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import zodToJsonSchema from "zod-to-json-schema";
import { idSchema, userSchema, usersSchema } from "../zod/zodSchema";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const userJsonSchema = zodToJsonSchema(userSchema, "userSchema");
const idJsonSchema = zodToJsonSchema(idSchema, "idSchema");

//server
const server = fastify({
  logger: { transport: { target: "pino-pretty" } },
});

server.setErrorHandler((error, request, response) => {
  // server.log.error(error);
  // response.code(500).send({ error: error });
  if (error.code === "ENOENT") {
    server.log.error(error);
    response.code(500).send({ error: "Internal Serve Error" });
  } else if (error instanceof z.ZodError) {
    server.log.error(error.issues);
    response.code(500).send({ error: "Internal Serve Error" });
  } else {
    response.code(500).send({ error: error.message });
  }
});

//route
server.get("/api/users", async function handler(request, response) {
  const data = JSON.parse(
    await fs.readFile(path.join(__dirname, "/../data/users.json"), {
      encoding: "utf8",
    })
  );
  const parsedUsers = usersSchema.parse(data);
  response
    .code(200)
    .header("Content-Type", "application/json;charset=utf-8")
    .send(parsedUsers);
});

server.post(
  "/api/users",
  {
    schema: {
      body: userJsonSchema,
    },
  },
  async function handler(request, response) {
    try {
      const data = JSON.parse(
        await fs.readFile(path.join(__dirname, "/../data/users.json"), {
          encoding: "utf8",
        })
      );
      const parsedUsers = usersSchema.parse(data);
      const parsedNewUser = userSchema.parse(request.body);
      parsedUsers.push(parsedNewUser);
      const updatedData = new Uint8Array(
        Buffer.from(JSON.stringify(parsedUsers, undefined, 2))
      );
      writeFile(
        path.join(__dirname, "/../data/users.json"),
        updatedData,
        "utf-8",
        (error: any) => {
          if (error) {
            server.log.error(error);
            throw new Error(error);
          }
        }
      );
      response.code(201).send("Created");
    } catch (error) {
      server.log.error(error.message);
      response.code(500).send(error);
    }
  }
);

server.patch(
  "/api/users",
  {
    schema: {
      body: userJsonSchema,
    },
  },
  async function handler(request, response) {
    try {
      const data = JSON.parse(
        await fs.readFile(path.join(__dirname, "/../data/users.json"), {
          encoding: "utf8",
        })
      );
      const parsedUsers = usersSchema.parse(data);
      const parsedNewUser = userSchema.safeParse(request.body);
      if (!parsedNewUser.success) {
        return response.code(400).send({
          error: parsedNewUser.error,
          message:
            "Invalid request body format. Please ensure the request body follows the required schema",
        });
      }
      if (!parsedUsers.some((user) => user.id === parsedNewUser.data.id)) {
        throw new Error("the user is not Found");
      }
      const updatedUsers = parsedUsers.map((user) =>
        user.id !== parsedNewUser.data.id
          ? user
          : {
              ...user,
              name: parsedNewUser.data.name,
              surname: parsedNewUser.data.surname,
            }
      );
      const updatedData = new Uint8Array(
        Buffer.from(JSON.stringify(updatedUsers, undefined, 2))
      ); // binary data encoded in UTF-8 in buffer
      writeFile(
        path.join(__dirname, "/../data/users.json"),
        updatedData,
        "utf-8",
        (error: any) => {
          if (error) {
            server.log.error(error);
            throw new Error(error);
          }
        }
      );
      response.code(200).send("Updated");
    } catch (error) {
      server.log.error(error);
      response.code(500).send(error);
    }
  }
);

server.delete(
  "/api/users",
  { schema: { body: idJsonSchema } },
  async function handler(request, response) {
    try {
      const data = JSON.parse(
        await fs.readFile(path.join(__dirname, "/../data/users.json"), {
          encoding: "utf8",
        })
      );
      const parsedUsers = usersSchema.parse(data);
      const parsedId = idSchema.parse(request.body);
      if (!parsedUsers.some((user) => user.id === parsedId.id)) {
        throw new Error("The user is not found");
      }
      const updatedUsers = parsedUsers.filter(
        (user) => user.id !== parsedId.id
      );
      const updatedData = new Uint8Array(
        Buffer.from(JSON.stringify(updatedUsers, undefined, 2))
      );
      writeFile(
        path.join(__dirname, "/../data/users.json"),
        updatedData,
        "utf-8",
        (error: any) => {
          if (error) {
            server.log.error(error);
            throw new Error(error);
          }
        }
      );
      response.code(204).send("Deleted");
    } catch (error) {
      server.log.error(error);
      response.code(500).send(error);
    }
  }
);

//listening on a port should be after defining all the routes
try {
  await server.listen({ port: 3000 });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
