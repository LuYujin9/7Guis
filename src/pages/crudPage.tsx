import { NavLink } from "react-router-dom";
import { Crud } from "../components/Crud";
import { CrudTwo } from "../components/CrudTwo";

export function CrudPage() {
  return (
    <>
      <Crud />
      <CrudTwo />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
