import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState<number | undefined>(undefined);

  function updateFromCelsius(event: React.ChangeEvent<HTMLInputElement>) {
    setCelsius(event.target.value ? Number(event.target.value) : undefined);
    //console.log(event.target.value);
  }

  function updateFromFahrenheit(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    if (event.target.value) {
      const updatedCelsius = fahrenheitToCelsius(Number(event.target.value));
      //console.log(updatedCelsius);
      setCelsius(updatedCelsius);
      return;
    }
    setCelsius(undefined);
  }

  function fahrenheitToCelsius(input: number) {
    //return (input - 32) * (5 / 9);
    return Math.floor((input - 32) * (5 / 9) * 100) / 100;
  }

  function celsiusToFahrenheit(input: number | undefined) {
    if (input !== undefined) {
      //return input * (9 / 5) + 32;
      return Math.floor((input * (9 / 5) + 32) * 100) / 100;
    }
    return undefined;
  }

  return (
    <>
      <div>
        <input
          type="number"
          id="celsius"
          value={celsius !== undefined ? celsius?.toString() : ""}
          onChange={updateFromCelsius}
        />
        <label htmlFor="celsius">Celsius</label>
        <input
          type="number"
          id="fahrenheit"
          value={
            celsiusToFahrenheit(celsius) !== undefined
              ? celsiusToFahrenheit(celsius)?.toString()
              : ""
          }
          onChange={updateFromFahrenheit}
        />
        <label htmlFor="fahrenheit">Fahrenheit</label>
      </div>
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
