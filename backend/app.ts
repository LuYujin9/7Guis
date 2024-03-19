import zodToJsonSchema from "zod-to-json-schema";
import { idSchema, userSchema, usersSchema } from "../zod/zodSchema";
import fastify from "fastify";
import { Database } from "./database";

export const userJsonSchema = zodToJsonSchema(userSchema, "userSchema");
export const idJsonSchema = zodToJsonSchema(idSchema, "idSchema");

export function build(opts = {}, database: Database) {
  const server = fastify(opts);
  const { getUsersData, updateUsersData } = database;

  server.get("/api/users", async (request, response) => {
    try {
      const data = await getUsersData();
      const parsedUsers = usersSchema.parse(data);
      response
        .code(200) //问题: header is automatically generated (content-length, type, date,). without header here ? yes?
        .send(parsedUsers);
    } catch (error) {
      server.log.error(error);
      if (error.code < 500) {
        response.code(error.code).send(error);
      } else {
        response.code(500).send("Something in the server can't work.");
      }
    }
  });

  server.post(
    "/api/users",
    // {
    //   schema: {
    //     body: userJsonSchema,//思考: 能不能以后写回来
    //   },
    // },
    async (request, response) => {
      try {
        const parsedNewUser = userSchema.safeParse(request.body);
        if (!parsedNewUser.success) {
          return response.code(400).send({
            statusCode: 400,
            code: "FST_ERR_VALIDATION",
            statusText: "Bad Request",
            message: "Body must conform to the schema.",
            schema: userJsonSchema,
          });
        }
        const data = await getUsersData();
        const parsedUsers = usersSchema.parse(data);
        parsedUsers.push(parsedNewUser.data);
        const promise = await updateUsersData(parsedUsers);
        if (promise === "success") {
          response.code(201).send("Resource created successfully.");
        }
        return response
          .code(500)
          .send("Something in the database didn't work.");
      } catch (error) {
        server.log.error(error);
        if (error.code < 500) {
          response.code(error.code).send(error);
        } else {
          response.code(500).send("Something in the server can't work."); //问题: is it ok?
        }
      }
    }
  );

  server.put(
    "/api/users",
    // {
    //   schema: {
    //     body: userJsonSchema,//思考,能不能以后写回来
    //   },
    // },
    async (request, response) => {
      try {
        const parsedNewUser = userSchema.safeParse(request.body);
        if (!parsedNewUser.success) {
          return response.code(400).send({
            statusCode: 400,
            code: "FST_ERR_VALIDATION",
            statusText: "Bad Request",
            message: "Body must conform to the schema.",
            schema: userJsonSchema,
          });
        }
        const data = await getUsersData();
        const parsedUsers = usersSchema.parse(data);
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
        const promise = await updateUsersData(updatedUsers);
        if (promise === "success") {
          return response.code(200).send("Resource updated successfully.");
        }
        return response
          .code(500)
          .send("Something in the database didn't work.");
      } catch (error) {
        server.log.error(error);
        if (error.code < 500) {
          response.code(error.code).send(error);
        } else {
          response.code(500).send("Something in the server can't work."); //TO DO:
        }
      }
    }
  );

  server.delete(
    "/api/users",
    // { schema: { body: idJsonSchema } },//思考: 能不能以后写回来
    async (request, response) => {
      try {
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
        const data = await getUsersData();
        const parsedUsers = usersSchema.parse(data);
        if (!parsedUsers.some((user) => user.id === parsedId.data.id)) {
          return response
            .code(404)
            .send(`The user with id: ${parsedId.data.id} is not found.`);
        }
        const updatedUsers = parsedUsers.filter(
          (user) => user.id !== parsedId.data.id
        );
        const promise = await updateUsersData(updatedUsers);
        if (promise === "success") {
          response.code(200).send("Resource deleted successfully.");
        }
        return response
          .code(500)
          .send("Something in the database didn't work.");
      } catch (error) {
        server.log.error(error);
        if (error.code < 500) {
          response.code(error.code).send(error);
        } else {
          response.code(500).send("Something in the server can't work."); //TO DO:
        }
      }
    }
  );
  return server;
}
