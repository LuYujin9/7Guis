import { NavLink } from "react-router-dom";
import { FlightBooker } from "../components/FlightBooker";

export function FlightBookerPage() {
  return (
    <>
      <FlightBooker />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
