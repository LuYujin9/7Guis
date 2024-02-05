import { NavLink } from "react-router-dom";
import TemperatureConverter from "../components/TemperatureConverter";
import { useId } from "react";

export default function TemperatureConverterPage() {
  return (
    <>
      <TemperatureConverter id={useId()} />
      <TemperatureConverter id={useId()} />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
