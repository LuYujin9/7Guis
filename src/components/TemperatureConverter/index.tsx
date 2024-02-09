import { useState } from "react";
import "./index.css";

type props = {
  id: string;
};

export default function TemperatureConverter({ id }: props) {
  const [values, setFahrenheit, setCelsius] = useSyncedState();

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
    <div className="temperature-converter" id={id}>
      <label className="input-area">
        <input
          type="number"
          value={values.celsius === undefined ? "" : values.celsius}
          className="temInput"
          onChange={updateFromCelsius}
        />
        Celsius
      </label>
      <p>=</p>
      <label className="input-area">
        <input
          type="number"
          value={values.fahrenheit === undefined ? "" : values.fahrenheit}
          className="temInput"
          onChange={updateFromFahrenheit}
        />
        Fahrenheit
      </label>
    </div>
  );
}

const useSyncedState = (): [
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

function fahrenheitToCelsius(input: undefined | number) {
  if (input === undefined) {
    return undefined;
  }
  return Math.floor((input - 32) * (5 / 9) * 100) / 100;
}

function celsiusToFahrenheit(input: undefined | number) {
  if (input === undefined) {
    return undefined;
  }
  return Math.floor((input * (9 / 5) + 32) * 100) / 100;
}
