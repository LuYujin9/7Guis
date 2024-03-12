import { User } from "./components/Crud";

export async function fetchUsers(
  signal?: AbortSignal
): Promise<User[] | false> {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      signal: signal,
    }); //readable stream. it is a stream , only can read one time
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    if (response.status === 404) {
      throw new Error("404, Not found");
    }
    const body = await response.json();
    throw new Error(JSON.stringify(body.error));
  } catch (error) {
    console.error(error);
    return false;
  }
} //are they api?

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
    if (response.status === 404) {
      throw new Error("404, Not found");
    }
    const error = await response.json();
    throw new Error(error.message);
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
    if (response.status === 404) {
      throw new Error("404, Not found");
    }
    const error = await response.json();
    throw new Error(error.message);
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
    if (response.status === 404) {
      throw new Error("404, Not found");
    }
    const error = await response.json();
    throw new Error(error.message);
  } catch (error) {
    console.error(error);
    return false;
  }
}
