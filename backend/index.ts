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

//route
server.get("/api/users", async function handler(request, response) {
  try {
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
  } catch (error) {
    if (error.code === "ENOENT" || error instanceof z.ZodError) {
      server.log.error(error);
      response
        .code(500)
        .header("Content-Type", "text/plain;charset=utf-8")
        .send("Something in the server can't work.");
    } else {
      response
        .code(error.code || 500)
        .header("Content-Type", "application/json;charset=utf-8")
        .send(error);
    }
  }
});

server.post(
  "/api/users",
  // {
  //   schema: {
  //     body: userJsonSchema,//TO DO 再次思考,能不能以后写回来
  //   },
  // },
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
        return response.send({
          statusCode: 400,
          code: "FST_ERR_VALIDATION",
          statusText: "Bad Request",
          message: "Body must conform to the schema.",
          schema: userJsonSchema,
        });
      }
      if (!parsedUsers.some((user) => user.id === parsedNewUser.data.id)) {
        return response
          .code(404)
          .send(`The user with id: ${parsedNewUser.data.id} is not found.`);
      }
      parsedUsers.push(parsedNewUser.data);
      const updatedData = new Uint8Array(
        Buffer.from(JSON.stringify(parsedUsers, undefined, 2))
      );
      writeFile(
        path.join(__dirname, "/../data/users.json"),
        updatedData,
        "utf-8",
        (error: any) => {
          if (error) {
            throw new Error(error);
          }
        }
      );
      response.code(201).send("Created.");
    } catch (error) {
      if (error.code === "ENOENT" || error instanceof z.ZodError) {
        server.log.error(error);
        response
          .code(500)
          .send({ error: { code: 500, message: "Internal Serve Error" } });
      } else {
        response.code(error.code || 500).send(error);
      }
    }
  }
);

server.put(
  "/api/users",
  // {
  //   schema: {
  //     body: userJsonSchema,//TO DO 再次思考,能不能以后写回来
  //   },
  // },
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
        return response.send({
          statusCode: 400,
          code: "FST_ERR_VALIDATION",
          statusText: "Bad Request",
          message: "Body must conform to the schema.",
          schema: userJsonSchema,
        });
      }
      if (!parsedUsers.some((user) => user.id === parsedNewUser.data.id)) {
        return response
          .code(404)
          .send(`The user with id: ${parsedNewUser.data.id} is not found.`);
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
      response.code(200).send("Updated.");
    } catch (error) {
      if (error.code === "ENOENT" || error instanceof z.ZodError) {
        server.log.error(error);
        response
          .code(500)
          .header("Content-Type", "text/plain;charset=utf-8")
          .send("Something in the server can't work.");
      } else {
        response
          .code(error.code || 500)
          .header("Content-Type", "application/json;charset=utf-8")
          .send(error);
      }
    }
  }
);

server.delete(
  "/api/users",
  // { schema: { body: idJsonSchema } },//TO DO 再次思考,能不能以后写回来
  async function handler(request, response) {
    try {
      const data = JSON.parse(
        await fs.readFile(path.join(__dirname, "/../data/users.json"), {
          encoding: "utf8",
        })
      );
      const parsedUsers = usersSchema.parse(data);
      const parsedId = idSchema.safeParse(request.body);
      if (!parsedId.success) {
        return response.code(400).send({
          statusCode: 400,
          code: "FST_ERR_VALIDATION",
          statusText: "Bad Request",
          message: "Body must conform to the schema.",
          schema: idJsonSchema,
        });
      }
      if (!parsedUsers.some((user) => user.id === parsedId.data.id)) {
        return response
          .code(404)
          .send(`The user with id: ${parsedId.data.id} is not found.`);
      }
      const updatedUsers = parsedUsers.filter(
        (user) => user.id !== parsedId.data.id
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
      if (error.code === "ENOENT" || error instanceof z.ZodError) {
        server.log.error(error);
        response
          .code(500)
          .header("Content-Type", "text/plain;charset=utf-8")
          .send("Something in the server can't work.");
      } else {
        response
          .code(error.code || 500)
          .header("Content-Type", "application/json;charset=utf-8")
          .send(error);
      }
    }
  }
);

try {
  await server.listen({ port: 3000 });
} catch (error) {
  server.log.error(error);
  process.exit(1); //exit code https://www.geeksforgeeks.org/node-js-exit-codes/
}

// async function postInject() {
//   try {
//     const res = await server.inject({
//       method: "POST",
//       url: "/api/users",
//       payload: {
//         state: 12,
//       },
//     });
//     const body = await res.json();
//     // console.log(body);
//     throw new Error(`${body.error.statusCode}, ${body.error.code}`);
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// }

// postInject();
