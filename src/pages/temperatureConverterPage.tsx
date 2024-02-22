import { NavLink } from "react-router-dom";
import { TemperatureConverter } from "../components/TemperatureConverter";
import { useId } from "react";

export function TemperatureConverterPage() {
  return (
    <>
      <TemperatureConverter id={useId()} />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
