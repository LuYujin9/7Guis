import { usersSchema } from "../zod/zodSchema";
import { User } from "./components/Crud";
import { Users } from "./pages/api/users";

export async function fetchUsers(signal?: AbortSignal): Promise<Users | false> {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      signal: signal,
    });
    if (response.ok) {
      const data = await response.json();
      const parsedUsers = usersSchema.safeParse(data);
      if (!parsedUsers.success) {
        throw new Error("The format of users are not right.");
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

export async function createUser(user: User): Promise<boolean> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
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

export async function updateUser(user: User): Promise<boolean> {
  try {
    const response = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify(user),
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

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
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
