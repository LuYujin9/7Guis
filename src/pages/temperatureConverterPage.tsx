import { NavLink } from "react-router-dom";
import { TemperatureConverter } from "../components/TemperatureConverter";
import { Units } from "../type/types";

const units = [
  {
    name: "celsius",
    toCelsius: (celsius) => {
      return celsius;
    },
    fromCelsius: (celsius) => {
      return celsius;
    },
  },
  {
    name: "fahrenheit",
    toCelsius: (fahrenheit) => {
      return Number(((fahrenheit - 32) * (5 / 9)).toFixed(2));
    },
    fromCelsius: (celsius) => {
      return Number((celsius * (9 / 5) + 32).toFixed(2));
    },
  },
  {
    name: "kelvin",
    toCelsius: (kelvin) => {
      return Number((kelvin - 273.15).toFixed(2));
    },
    fromCelsius: (celsius) => {
      return Number((celsius + 273.15).toFixed(2));
    },
  },
] satisfies Units;

export function TemperatureConverterPage() {
  return (
    <>
      <TemperatureConverter units={units} />
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
