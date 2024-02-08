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
      </ul>
    </>
  );
}
