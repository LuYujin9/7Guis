import { usersSchema } from "../zod/zodSchema";
import { User } from "./components/Crud";

// Generics
type Response<Data> =
  | {
      type: "ok";
      data: Data;
      error?: never;
    }
  | {
      type: "error";
      data?: never;
      error: string;
    };
//因为type的兼容性, data有可能是string, 有可能在error的情况下,还有data, 所以写作never,来保证它永远不存在.????

function ok<T>(data: T): Response<T> {
  return { type: "ok", data };
}

function err<T>(error: string): Response<T> {
  return { type: "error", error };
}

export async function fetchUsers(): Promise<Response<User[]>> {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
    });
    // console.log(response);
    if (!response.ok) {
      return err([response.status, response.statusText].join(", "));
    }
    try {
      const body = await response.json();
      const parsedUsers = usersSchema.safeParse(body);
      if (!parsedUsers.success) {
        return err("The format of users are not right.");
      }
      return ok(parsedUsers.data);
    } catch (error) {
      return err("json parsing failed");
    }
  } catch (error) {
    return err("fetch failed");
  }
}

export async function createUser(user: User): Promise<Response<string>> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    // console.log(response);
    if (!response.ok) {
      // TO DO if (response.status === 400) 400的时候特别接收到具体的type内容
      //需要了解例如404和400吗????
      // console.log(response.json());
      return err([response.status, response.statusText].join(", "));
    }
    return ok("The new user is created ");
  } catch (error) {
    return err("fetch failed");
  }
}

export async function updateUser(user: User): Promise<Response<string>> {
  try {
    const response = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify(user),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    if (!response.ok) {
      return err([response.status, response.statusText].join(", "));
    }
    return ok("The new user is created ");
  } catch (error) {
    return err("fetch failed");
  }
}

export async function deleteUser(id: string): Promise<Response<string>> {
  try {
    const response = await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    if (!response.ok) {
      if (response.status === 400) {
        const payload = await response.json();
        return err(
          [payload.statusCode, payload.message, payload.schema].join(", ")
        );
      }
      if (response.status === 404) {
        return err([response.status, await response.text()].join(", "));
      }
      return err([response.status, response.statusText].join(", "));
    }
    return ok("The new user is created ");
  } catch (error) {
    return err("fetch failed");
  }
}
