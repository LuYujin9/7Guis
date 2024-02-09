import { NavLink } from "react-router-dom";
import FlightBooker from "../components/FlightBooker";

export default function FlightBookerPage() {
  return (
    <>
      <FlightBooker />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
