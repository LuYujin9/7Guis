import { NavLink } from "react-router-dom";
import { Crud, User } from "../components/Crud";

const initialUsers: User[] = [
  { name: "Jane", surname: "Davis", id: "0" },
  { name: "John", surname: "Wilson", id: "1" },
  { name: "Jack", surname: "Roman", id: "2" },
  { name: "Isabella", surname: "White", id: "3" },
  { name: "Jane", surname: "Davis", id: "4" },
  { name: "John", surname: "Wilson", id: "5" },
  { name: "Jack", surname: "Roman", id: "6" },
  { name: "Isabella", surname: "White", id: "7" },
  { name: "Jane", surname: "Davis", id: "8" },
  { name: "John", surname: "Wilson", id: "9" },
  { name: "Jack", surname: "Roman", id: "10" },
];

export function CrudPage() {
  return (
    <>
      <Crud users={initialUsers} />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
