import fastify from "fastify";
// import { sleep } from "./utils";
const server = fastify({ logger: { transport: { target: "pino-pretty" } } });
import fs from "fs/promises";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";
import path from "path";

//share the Type between backend and frontend? https://trpc.io/docs/client/react/infer-types

const userBodyJsonSchema = {
  type: "object",
  required: ["name", "surname", "id"],
  properties: {
    name: { type: "string" },
    surname: { type: "string" },
    id: { type: "string" },
  },
};

const usersBodyJsonSchema = { type: "array", items: userBodyJsonSchema };
const opts = {
  schema: { body: usersBodyJsonSchema },
};
// server.register((instance,opts,next)=>{

// const insertOne = {
//   body: {
//     type: "object",
//     required: ["name", "surname", "id"],
//     properties: {
//       name: { type: "string" },
//       surname: { type: "string" },
//       id: { type: "string" },
//     },
//   },
// };

// post 之后如何更新 get date
//理论上,body只需要单一user
server.post("/api/users", opts, async function handler(request, response) {
  try {
    const prevData = await fs.readFile("./data/users.json", {
      encoding: "utf8",
    });
    // server.log.info(prevData);

    // const updatedData = JSON.parse(prevData).push(request.body);

    // server.log.info(request.body);
    const data = new Uint8Array(Buffer.from(JSON.stringify(request.body)));
    writeFile("./data/users.json", data, "utf-8", (err: any) => {
      if (err) {
        server.log.error(err);
        response.code(500).send(err + "the data can't be wrote");
      }
    });
  } catch (err) {
    server.log.error(err);
    response.code(500).send({ error: "the user can't be created" });
  }
});

//   instance.put("/api/users",opts,async function handler(request,reply) {

//   })
//   instance.delete("/api/users",{schema:{body:{type:"object",properties:{id:"string"}}}},async function handler(request,reply) {

//   })
// })

// const randomNumber = Math.random();
// if (randomNumber < 0.5) {
//   return response.code(404).send({
//     error: "not found",
//     reason: `${randomNumber} is not a good number, I can't show you the user list.`,
//   });
// } else {
//   await sleep(100);
server.get("/api/users", async function handler(request, response) {
  try {
    const data = await fs.readFile("./data/users.json", {
      encoding: "utf8",
    });
    // const users = JSON.parse(data);
    // console.log(users);
    response.code(200).send(data);
  } catch (err) {
    server.log.error(err.message, "JSON file can't be read");
    response.code(500).send({ error: "the json file can't be read" });
  }
});
// }
// 文件是空的时候,返回500

try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
