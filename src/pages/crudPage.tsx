import { NavLink } from "react-router-dom";
import Crud from "../components/Crud";

export default function CrudPage() {
  return (
    <>
      <Crud />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
