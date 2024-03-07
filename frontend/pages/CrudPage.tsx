import { NavLink } from "react-router-dom";
import { Crud, User } from "../components/Crud";
import { useEffect, useState } from "react";

export async function getDate(
  url: string,
  setData: (data: any) => void, // data is any type. ok??
  signal?: AbortSignal
) {
  try {
    const response = await fetch(url, { method: "GET", signal: signal });
    if (response.ok) {
      const data = await response.json();
      setData(data);
    }
    if (response.status === 404) throw new Error("404, Not found");
  } catch (error) {
    console.error(error);
  }
}

export function CrudPage() {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getDate(
      "/api/users",
      (data) => {
        setUsers(data);
      },
      controller.signal
    );
    return () => controller.abort();
  }, []);

  return (
    <>
      {users ? <Crud users={users} /> : <div>loading...</div>}
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
