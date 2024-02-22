import { NavLink } from "react-router-dom";
import { FlightBookerTwo } from "../components/FlightBookerTwo";

export function FlightBookerPage() {
  return (
    <>
      <FlightBookerTwo />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
