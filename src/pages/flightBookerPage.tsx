import { NavLink } from "react-router-dom";
import { FlightBooker } from "../components/FlightBooker";
import { FlightBookerTwo } from "../components/FlightBookerTwo";

export function FlightBookerPage() {
  return (
    <>
      <FlightBooker />
      <FlightBookerTwo />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
