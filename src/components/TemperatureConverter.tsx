import { useState } from "react";
import { TemperatureInput } from "./TemperatureInput";
import { Units } from "../pages/TemperatureConverterPage";

type Temperature = number | "";

export function TemperatureConverter({ units }: { units: Units }) {
  const [celsius, setCelsius] = useState<Temperature>("");
  const [lastChangedInput, setLastChangedInput] = useState<{
    name: string;
    value: string;
  } | null>(null);

  const unitNames = units.map((unit) => unit.name);
  const message = isValueInvalid(celsius) ? "The value is invalid" : "";

  function setUpdatedCelsius(name: string, input: "" | number) {
    setCelsius(
      input === ""
        ? ""
        : units.find((unit) => unit.name === name)!.toCelsius(input)
    );
  }

  function calculateInputDisplayValue(name: string): string {
    if (lastChangedInput?.name === name) {
      return lastChangedInput.value;
    }
    return celsius === ""
      ? ""
      : units
          .find((unit) => unit.name === name)!
          .fromCelsius(celsius)
          .toString();
  }

  function handleInputChange(
    name: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const input = e.target.value;
    setLastChangedInput({
      name: e.target.name,
      value: input,
    });
    if (!isNaN(Number(input)) && input !== "-") {
      setUpdatedCelsius(name, input ? Number(input) : "");
    }
  }

  return (
    <div className="flex flex-col w-[15rem] m-auto mt-3 rounded bg-blue-100 sm:flex-row sm:w-[25rem] sm:p-3 sm:bg-green-100 ">
      {unitNames.map((name, index) => (
        <TemperatureInput
          key={index}
          name={name}
          value={calculateInputDisplayValue(name)}
          isValueInvalid={isValueInvalid(celsius)}
          onChange={(e) => {
            handleInputChange(name, e);
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
