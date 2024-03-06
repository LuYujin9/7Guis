import fastify from "fastify";
import { sleep } from "./utils";
import users from "../data/users.json" with {type :"json"};
const server = fastify({ logger: true }); //what is logger

 //share the Type between backend and frontend? https://trpc.io/docs/client/react/infer-types

// const userBodyJsonSchema = {
//     type:'object',
//     required:['name','surname','id'],
//     properties: { name: {type:'string'}, surname: {type:'string'},id: {type:'string'} }}

// const usersBodyJsonSchema ={type:"array",
// "items":{userBodyJsonSchema
// }}
// const opts={
//     schema:{body:{userBodyJsonSchema}}
// }
// server.register((instance,opts,next)=>{

//   instance.post("/api/users",opts,async function handler(request,reply) {
      
//   })
  
//   instance.put("/api/users",opts,async function handler(request,reply) {
      
//   })
//   instance.delete("/api/users",{schema:{body:{type:"object",properties:{id:"string"}}}},async function handler(request,reply) {
      
//   })
// })
  
  server.get("/api/users",async function handler(request, response) {
    // const randomNumber = Math.random();
    // if (randomNumber < 0.5) {
    //   return response.code(404).send({
    //     error: "not found",
    //     reason: `${randomNumber} is not a good number, I can't show you the user list.`,
    //   });
    // } else {
    //   await sleep(100);
      return users
    // }
  });


try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

// var fs = require("fs");
// fs.readFile("../../data/users.json", "utf8", function (err: any, data: any) {
//   console.log(err);
//   console.log(data);
// });
// console.log("readFile called");
