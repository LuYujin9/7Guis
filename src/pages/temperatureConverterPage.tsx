import { NavLink } from "react-router-dom";
import { TemperatureConverter } from "../components/TemperatureConverter";
import { useId } from "react";
import { TemperatureConverterTwo } from "../components/TemperatureConverterTwo";

export function TemperatureConverterPage() {
  return (
    <>
      <TemperatureConverter id={useId()} />
      <TemperatureConverterTwo id={useId()} />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
