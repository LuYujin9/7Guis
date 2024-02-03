import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function TemperatureConverterTwo() {
  const useSycedState = (): [
    { celsius: undefined | number; fahrenheit: undefined | number },
    (newValue: undefined | number) => void,
    (newValue: undefined | number) => void
  ] => {
    const [values, setValues] = useState<{
      celsius: undefined | number;
      fahrenheit: undefined | number;
    }>({
      celsius: undefined,
      fahrenheit: celsiusToFahrenheit(undefined),
    });

    function fahrenheitToCelsius(input: undefined | number) {
      if (input === undefined) {
        return undefined;
      }
      //console.log(input, (input - 32) * (5 / 9));
      return Math.floor((input - 32) * (5 / 9) * 100) / 100;
    }
    function celsiusToFahrenheit(input: undefined | number) {
      if (input === undefined) {
        return undefined;
      }
      //console.log(input, input * (9 / 5) + 32);
      return Math.floor((input * (9 / 5) + 32) * 100) / 100;
    }

    const setFahrenheit = (newValue: undefined | number) => {
      setValues({
        celsius: fahrenheitToCelsius(newValue),
        fahrenheit: newValue,
      });
    };

    const setCelsius = (newValue: undefined | number) => {
      setValues({
        celsius: newValue,
        fahrenheit: celsiusToFahrenheit(newValue),
      });
    };

    return [values, setFahrenheit, setCelsius];
  };

  const [values, setFahrenheit, setCelsius] = useSycedState();

  function reset() {
    setFahrenheit(undefined);
  }

  function updateFromCelsius(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setCelsius(undefined);
      return;
    }
    setCelsius(Number(event.target.value));
  }

  function updateFromFahrenheit(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setFahrenheit(undefined);
      return;
    }
    setFahrenheit(Number(event.target.value));
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
        <button onClick={reset}>reset</button>
      </div>
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
