import { User } from "./../frontend/components/Crud";
import fs from "fs/promises";
import zodToJsonSchema from "zod-to-json-schema";
import { idSchema, userSchema, usersSchema } from "../zod/zodSchema";
import fastify from "fastify";
import { filePath } from "./connect";

const userJsonSchema = zodToJsonSchema(userSchema, "userSchema");
const idJsonSchema = zodToJsonSchema(idSchema, "idSchema");

export function build(opts = {}) {
  const server = fastify(opts);

  server.get("/api/users", async (request, response) => {
    try {
      const data = await getUsersData();
      const parsedUsers = usersSchema.parse(data);
      response
        .code(200) //问题: header已经自动生成了 content-length, type, date, 可以省略自己输入header吗?
        .send(parsedUsers);
    } catch (error) {
      server.log.error(error);
      if (error.code < 500) {
        response.code(error.code).send(error);
      } else {
        response.code(500).send("Something in the server can't work."); //思考: 怎么设置才能更好的处理send的error
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
        const data = await getUsersData();
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
        parsedUsers.push(parsedNewUser.data);
        const promise = await updateUsersData(parsedUsers);
        if (promise === undefined)
          response.code(201).send("resource created successfully");
      } catch (error) {
        server.log.error(error);
        if (error.code < 500) {
          response.code(error.code).send(error);
        } else {
          response.code(500).send("Something in the server can't work."); //思考: 怎么设置才能更好的处理send的error
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
        const data = await getUsersData();
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
        const promise = await updateUsersData(updatedUsers);
        if (promise === undefined)
          response.code(200).send("resource updated successfully");
      } catch (error) {
        server.log.error(error);
        if (error.code < 500) {
          response.code(error.code).send(error);
        } else {
          response.code(500).send("Something in the server can't work."); //思考: 怎么设置才能更好的处理send的error
        }
      }
    }
  );

  server.delete(
    "/api/users",
    // { schema: { body: idJsonSchema } },//思考: 能不能以后写回来
    async (request, response) => {
      try {
        const data = await getUsersData();
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
        const promise = await updateUsersData(updatedUsers);
        if (promise === undefined)
          response.code(200).send("resource deleted successfully");
      } catch (error) {
        server.log.error(error);
        if (error.code < 500) {
          response.code(error.code).send(error);
        } else {
          response.code(500).send("Something in the server can't work."); //思考: 怎么设置才能更好的处理send的error
        }
      }
    }
  );
  return server;
}

async function getUsersData(): Promise<User[]> {
  const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
  return data; //问题: 需要设定promise的type,类似fetchUsers那样来返回一个标准化的promise吗? 我个人觉得不用
}

async function updateUsersData(updatedUsers: User[]): Promise<void> {
  const updatedData = new Uint8Array(
    Buffer.from(JSON.stringify(updatedUsers, undefined, 2))
  );
  const promise = await fs.writeFile(filePath, updatedData, "utf-8");
  return promise;
}
