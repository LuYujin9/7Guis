import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function TemperatureConverter() {
  const [celsius, useCelsius] = useState<string>("");
  const [fahrenheit, useFahrenheit] = useState<string>("");

  function celsiusToFahrenheit(event: any) {
    useCelsius(event.target.value);
    const newCelsius = event.target.value;
    const newFahrenheit = Number(newCelsius) * (9 / 5) + 32;
    useFahrenheit(event.target.value === "" ? "" : newFahrenheit.toString());
  }

  function fahrenheitToCelsius(event: any) {
    useFahrenheit(event.target.value);
    const newFahrenheit = event.target.value;
    const newCelsius = (Number(newFahrenheit) - 32) * (5 / 9);
    useCelsius(event.target.value === "" ? "" : newCelsius.toString());
  }

  return (
    <>
      <div>
        <input
          type="number"
          id="celsius"
          value={celsius}
          onChange={celsiusToFahrenheit}
        />
        <label htmlFor="celsius">Celsius</label>
        <input
          type="number"
          id="fahrenheit"
          value={fahrenheit}
          onChange={fahrenheitToCelsius}
        />
        <label htmlFor="fahrenheit">Fahrenheit</label>
      </div>
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
