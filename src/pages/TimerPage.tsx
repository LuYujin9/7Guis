import { NavLink } from "react-router-dom";
import { Timer } from "../components/Timer";

export function TimerPage() {
  return (
    <>
      <Timer />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
