import { useState } from "react";

export function TemperatureConverter({ id }: { id: string }) {
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
    <div
      className="flex flex-col w-[15rem] m-auto mt-3 rounded bg-blue-100 sm:flex-row sm:w-[25rem] sm:p-3 sm:bg-green-100 "
      //priority? 无论在bg-blue-100 前或后加入 bg-red-100 都会呈现红色
      id={id}
    >
      <label className="flex-auto">
        <input
          className=" m-2 w-20 rounded border border-black"
          type="number"
          value={values.celsius === undefined ? "" : values.celsius}
          onChange={updateFromCelsius}
        />
        Celsius
      </label>
      <p className="flex-auto m-auto ">=</p>
      <label className="flex-auto">
        <input
          className="m-2 w-20 rounded border border-black"
          type="number"
          value={values.fahrenheit === undefined ? "" : values.fahrenheit}
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
