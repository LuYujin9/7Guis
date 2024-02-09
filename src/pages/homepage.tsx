import { NavLink } from "react-router-dom";

export default function Homepage() {
  return (
    <>
      <ul>
        <li>
          <NavLink to="/counter">counter</NavLink>
        </li>
        <li>
          <NavLink to="/temperatureConverter">Temperature Converter</NavLink>
        </li>
        <li>
          <NavLink to="/crudPage">crud page</NavLink>
        </li>
        <li>
          <NavLink to="/timerPage">Timer</NavLink>
        </li>
        <li>
          <NavLink to="/flightBookerPage">Flight Booker</NavLink>
        </li>
      </ul>
    </>
  );
}
