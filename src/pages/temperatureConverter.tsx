import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function TemperatureConverter() {
  const [values, setValues] = useState<{
    celsius: number | undefined;
    fahrenheit: number | undefined;
  }>({ celsius: undefined, fahrenheit: undefined });

  function updateFromCelsius(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setValues({ celsius: undefined, fahrenheit: undefined });
      return;
    }
    const updatedValues = {
      celsius: Number(event.target.value),
      fahrenheit: celsiusToFahrenheit(Number(event.target.value)),
    };
    setValues(updatedValues);
  }

  function updateFromFahrenheit(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setValues({ celsius: undefined, fahrenheit: undefined });
      return;
    }
    const updatedCelsius = {
      celsius: fahrenheitToCelsius(Number(event.target.value)),
      fahrenheit: Number(event.target.value),
    };
    setValues(updatedCelsius);
  }

  function fahrenheitToCelsius(input: number) {
    return Math.floor((input - 32) * (5 / 9) * 100) / 100;
  }

  function celsiusToFahrenheit(input: number) {
    return Math.floor(input * (9 / 5) + 32 * 100) / 100;
  }

  return (
    <>
      <div>
        <input
          type="number"
          id="celsius"
          value={values.celsius === undefined ? "" : values.celsius}
          onChange={updateFromCelsius}
        />
        <label htmlFor="celsius">Celsius</label>
        <input
          type="number"
          id="fahrenheit"
          value={values.fahrenheit === undefined ? "" : values.fahrenheit}
          onChange={updateFromFahrenheit}
        />
        <label htmlFor="fahrenheit">Fahrenheit</label>
      </div>
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
