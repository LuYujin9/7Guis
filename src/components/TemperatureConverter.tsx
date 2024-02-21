import { ChangeEvent, useState } from "react";
import { TemperatureInput } from "./TemperatureInput";

type Unit = {
  name: string;
  toCelsius: (arg0: number) => number;
  fromCelsius: (arg0: number) => number;
};
type Units = Unit[] & { 0: Unit };
type Temperature = number | "";

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
      return Math.floor((fahrenheit - 32) * (5 / 9) * 100) / 100;
    },
    fromCelsius: (celsius) => {
      return Math.floor((celsius * (9 / 5) + 32) * 100) / 100;
    },
  },
  {
    name: "kelvin",
    toCelsius: (kelvin) => {
      return Math.floor((kelvin - 273.15) * 100) / 100;
    },
    fromCelsius: (celsius) => {
      return Math.floor((celsius + 273.15) * 100) / 100;
    },
  },
] satisfies Units;

export function TemperatureConverter({ id }: { id: string }) {
  const [celsius, setCelsius] = useState<Temperature>("");
  const [focusedInput, setFocusedInput] = useState<{
    name: string;
    value: string;
  } | null>(null);

  const unitNames = units.map((unit) => unit.name);
  const message = isValueInvalid(celsius ? celsius : "")
    ? "The value is invalid"
    : "";

  function setUpdatedCelsius(name: string, input: "" | number) {
    if (input === "") {
      setCelsius("");
      return;
    }
    const celsius = units.find((unit) => unit.name === name)!.toCelsius(input);
    setCelsius(celsius);
  }

  function calculateInputDisplayValue(name: string): string {
    if (focusedInput?.name === name) {
      return focusedInput.value;
    }
    return celsius === ""
      ? ""
      : units
          .find((unit) => unit.name === name)!
          .fromCelsius(celsius)
          .toString();
  }

  function handelInputChange(
    name: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const input = e.target.value;
    setFocusedInput({
      name: e.target.name,
      value: input,
    });
    if (!isNaN(Number(input)) && input !== "-") {
      setUpdatedCelsius(name, input ? Number(input) : "");
    }
  }

  return (
    <div
      className="flex flex-col w-[15rem] m-auto mt-3 rounded bg-blue-100 sm:flex-row sm:w-[25rem] sm:p-3 sm:bg-green-100 "
      id={id}
    >
      {unitNames.map((name, index) => (
        <TemperatureInput
          key={index}
          name={name}
          value={calculateInputDisplayValue(name)}
          isValueInvalid={isValueInvalid(celsius ? celsius : "")}
          onChange={(e) => {
            handelInputChange(name, e);
          }}
        />
      ))}
      <p>{message}</p>
    </div>
  );
}

function isValueInvalid(value: number | "") {
  if (value === "") {
    return false;
  }
  return value < -273.15 ? true : false;
}
