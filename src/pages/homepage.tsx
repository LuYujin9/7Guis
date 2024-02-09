import { NavLink } from "react-router-dom";

export function Homepage() {
  return (
    <>
      <ul>
        <li>
          <NavLink to="/counter">Counter</NavLink>
        </li>
        <li>
          <NavLink to="/temperatureConverter">Temperature Converter</NavLink>
        </li>
        <li>
          <NavLink to="/timerPage">Timer</NavLink>
        </li>
        <li>
          <NavLink to="/flightBookerPage">Flight Booker</NavLink>
        </li>
        <li>
          <NavLink to="/crudPage">CRUD</NavLink>
        </li>
      </ul>
    </>
  );
}
