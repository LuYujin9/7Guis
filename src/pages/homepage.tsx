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
          <NavLink to="/flightBookerPage">Flight Booker</NavLink>
        </li>
        <li>
          <NavLink to="/practise">Practise</NavLink>
        </li>
      </ul>
    </>
  );
}
