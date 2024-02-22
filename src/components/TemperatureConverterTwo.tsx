import { ChangeEvent, useState } from "react";

// in this vision, input type is still number. not good.
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

export function TemperatureConverterTwo({ id }: { id: string }) {
  const [celsius, setCelsius] = useState<Temperature>("");
  const [focusedInputData, setFocusedInputData] = useState<{
    name: string;
    value: string;
  }>({
    name: "",
    value: "",
  });

  const unitNames = units.map((unit) => unit.name);
  const message = isValueInvalid(celsius ? celsius : "")
    ? "The value is invalid"
    : "";

  function setUpdatedCelsius(name: string, input: "" | number) {
    setCelsius(
      input === ""
        ? ""
        : units.find((unit) => unit.name === name)!.toCelsius(input)
    );
  }

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

  function handelInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    const name = e.target.name;
    const inputAction = (e.nativeEvent as InputEvent).inputType; //underlying browser event from DOM API, allow to use? disadvantage?
    setFocusedInputData({
      name: name,
      value: input,
    });
    console.log(focusedInputData.value === "", input);
    if (input !== "") {
      setUpdatedCelsius(name, Number(input));
      return;
    }
    if (isInputEmpty(inputAction, focusedInputData?.value)) {
      setUpdatedCelsius(name, "");
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
          onChange={(e) => handelInputChange(e)}
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

function isInputEmpty(inputAction: string, prevInputValue: string | undefined) {
  console.log(prevInputValue == "");
  return (
    (inputAction === "deleteContentBackward" && prevInputValue?.length === 1) ||
    (prevInputValue?.charAt(0) === "-" && prevInputValue?.length === 2) //can"t check e.g. "-1" changed to "-" or "-1."
  );
}

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
