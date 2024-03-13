import { idSchema } from "../../../zod/zodSchema";
import { z } from "zod";
import { usersSchema } from "../../../zod/zodSchema";
import { User } from "../../components/Crud";

export type Users = z.infer<typeof usersSchema>;
export type Id = z.infer<typeof idSchema>;

export async function handleUserRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  input?: User | Id
): Promise<Users | boolean> {
  if (method === "GET") {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const parsedUsers = usersSchema.safeParse(data);
        if (!parsedUsers.success) {
          throw new Error(
            "The data of users doesn't conform to the format.Contact the backend developers."
          );
        }
        return parsedUsers.data;
      }
      const body = await response.json();
      throw new Error(`${body.error.code}, ${body.error.message}`);
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  if (method === "PUT" || method === "POST" || method === "DELETE") {
    try {
      const response = await fetch("/api/users", {
        method: method,
        body: JSON.stringify(input),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (response.ok) {
        return true;
      }
      const body = await response.json();
      throw new Error(`${body.error.code}, ${body.error.message}`);
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  throw new Error("Unexpected error, check the method.");
}
//修改, 如果该 user 不存在, delete 的 line47 error , 来自于哪里?不该有!
