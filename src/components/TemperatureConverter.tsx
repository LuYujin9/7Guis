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

/* 可能有多项的object, 定义全部的type */
type TemperatureData = {
  [key: string]: number | "";
};

export function TemperatureConverter({ id }: { id: string }) {
  const [values, setUpdatedValues] = useSyncedState();

  const unitNames = units.map((unit) => unit.name);

  function handelInputChange(
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setUpdatedValues(
      name,
      event.target.value ? Number(event.target.value) : ""
    );
  }

  const message = isValueInvalid(values ? values.celsius : "")
    ? "The value is invalid"
    : "";

  return (
    <div
      className="flex flex-col w-[15rem] m-auto mt-3 rounded bg-blue-100 sm:flex-row sm:w-[25rem] sm:p-3 sm:bg-green-100 "
      id={id}
    >
      {unitNames.map((name, index) => (
        <TemperatureInput
          key={index}
          name={name}
          value={values ? values[name] : ""}
          isValueInvalid={isValueInvalid(values.celsius)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handelInputChange(name, event)
          }
        />
      ))}
      <p>{message}</p>
    </div>
  );
}

const useSyncedState = (): [
  TemperatureData,
  (name: string, newValue: "" | number) => void
] => {
  const [values, setValues] = useState<TemperatureData>({});
  function calculate(name: string, input: "" | number) {
    const toCelsius = units.find((unit) => unit.name === name)!.toCelsius;
    if (input === "") {
      const entries = units.map((unit) => {
        return [unit.name, ""];
      });
      return Object.fromEntries(entries);
    }
    const celsius = toCelsius(input);
    const entries = units.map((unit) => {
      return [unit.name, unit.fromCelsius(celsius)];
    });
    return Object.fromEntries(entries);
  }
  function setUpdatedValues(name: string, newValue: "" | number) {
    setValues(calculate(name, newValue));
  }
  return [values, setUpdatedValues];
};

function isValueInvalid(value: number | "") {
  if (value === "") {
    return false;
  }
  return value < -273.15 ? true : false;
}

function TemperatureInput({
  name,
  value,
  onChange,
  isValueInvalid,
}: {
  name: string;
  value: number | "";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isValueInvalid: boolean;
}) {
  return (
    <label className="flex-auto">
      <input
        className={` m-2 w-20 rounded border  border-black ${
          isValueInvalid ? "bg-red-500" : ""
        }`}
        type="number"
        value={value || value === 0 ? value : ""}
        onChange={onChange}
      />
      {name}
    </label>
  );
}
