import { ChangeEvent, useState } from "react";

type Unit = {
  name: string;
  toCelsius: (arg0: number) => number;
  fromCelsius: (arg0: number) => number;
};
//type Units=[Unit,...Unit[]]
type Units = Unit[] & { 0: Unit };

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
] satisfies Units; //single source of truth

type Temperature = number | "";

export function TemperatureConverterTwo({ id }: { id: string }) {
  const [celsius, setCelsius] = useSyncedState();
  const [focusedInputData, setFocusedInputData] = useState<{
    name: string;
    value: string;
  } | null>(null);

  const unitNames = units.map((unit) => unit.name);
  const message = isValueInvalid(celsius ? celsius : "")
    ? "The value is invalid"
    : "";

  function calculateInputDisplayValue(name: string): string {
    if (focusedInputData?.name === name) {
      return focusedInputData.value;
    }
    return celsius === ""
      ? ""
      : units
          .find((unit) => unit.name === name)!
          .fromCelsius(celsius)
          .toString();
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
            const input = e.target.value;
            const inputAction = (e.nativeEvent as InputEvent).inputType; //underlying browser event from DOM API, use or better not? disadvantage?
            setFocusedInputData({
              name: e.target.name,
              value: input,
            });
            if (input !== "") {
              setCelsius(name, Number(input));
              return;
            }
            if (shouldInputEmpty(inputAction, focusedInputData?.value)) {
              setCelsius(name, "");
            }
          }}
        />
      ))}
      <p>{message}</p>
    </div>
  );
}

const useSyncedState = (): [
  Temperature,
  (name: string, input: "" | number) => void
] => {
  const [celsius, setCelsius] = useState<Temperature>("");
  function setUpdatedCelsius(name: string, input: "" | number) {
    if (input === "") {
      setCelsius("");
      return;
    }
    const celsius = units.find((unit) => unit.name === name)!.toCelsius(input);
    setCelsius(celsius);
  }
  return [celsius, setUpdatedCelsius];
};

function isValueInvalid(value: number | "") {
  if (value === "") {
    return false;
  }
  return value < -273.15 ? true : false;
}

function shouldInputEmpty(
  inputAction: string,
  prevInputValue: string | undefined
) {
  return (
    (inputAction === "deleteContentBackward" && prevInputValue?.length === 1) ||
    (prevInputValue?.charAt(0) === "-" && prevInputValue?.length === 2)
  );
} // I don't like it.

function TemperatureInput({
  name,
  value,
  onChange,
  isValueInvalid,
}: {
  name: string;
  value: string | "";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isValueInvalid: boolean;
}) {
  return (
    <label className="flex-auto">
      <input
        className={` m-2 w-20 rounded border  border-black ${
          isValueInvalid ? "bg-red-500" : ""
        }`}
        type="number" //number
        value={value}
        name={name}
        onChange={onChange}
      />
      {name}
    </label>
  );
}
