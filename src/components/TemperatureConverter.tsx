import { ChangeEvent, useState } from "react";

//undefined , “” or null . which is better?
type TemperatureData = {
  [key: string]: any; // an other way????
  celsius: number | "";
  fahrenheit: number | "";
  kelvin: number | "";
  test: number | "";
};
//update the type

export function TemperatureConverter({ id }: { id: string }) {
  const [values, setUpdatedValues] = useSyncedState();

  const unitNames = ["celsius", "fahrenheit", "kelvin", "test"]; //update here

  function handelInputChange(
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setUpdatedValues(
      name,
      event.target.value ? Number(event.target.value) : ""
    );
  }

  const message = isValueInvalid("celsius", values ? values.celsius : "")
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
  TemperatureData | undefined,
  (name: string, newValue: "" | number) => void
] => {
  const [values, setValues] = useState<TemperatureData | undefined>();
  function calculate(name: string, input: "" | number) {
    switch (name) {
      case "celsius":
        return celsiusToOthers(input);
      case "fahrenheit":
        return fahrenheitToOthers(input);
      case "kelvin":
        return kelvinToOthers(input);
      //add new calculate function for unit hier
      default:
        throw new Error(`Unexpected name: ${name}`);
    }
  }
  function setUpdatedValues(name: string, newValue: "" | number) {
    const data = calculate(name, newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
      test: data.test,
    });
  }
  return [values, setUpdatedValues];
};

function celsiusToOthers(celsius: "" | number): TemperatureData {
  if (celsius === "") {
    return { celsius: "", fahrenheit: "", kelvin: "", test: "" };
  }
  const fahrenheit = Math.floor((celsius * (9 / 5) + 32) * 100) / 100;
  const kelvin = Math.floor((celsius + 273.15) * 100) / 100;
  const test = celsius + 1;
  //add
  return {
    celsius: celsius,
    fahrenheit: fahrenheit,
    kelvin: kelvin,
    test: test,
  }; //add
}

function fahrenheitToOthers(fahrenheit: "" | number): TemperatureData {
  if (fahrenheit === "") {
    return { celsius: "", fahrenheit: "", kelvin: "", test: "" };
  }
  const celsius = Math.floor((fahrenheit - 32) * (5 / 9) * 100) / 100;
  const kelvin = Math.floor((celsius + 273.15) * 100) / 100;
  const test = celsius + 1;
  //add
  return {
    celsius: celsius,
    fahrenheit: fahrenheit,
    kelvin: kelvin,
    test: test,
  }; //add
}

function kelvinToOthers(kelvin: "" | number): TemperatureData {
  if (kelvin === "") {
    return { celsius: "", fahrenheit: "", kelvin: "", test: "" };
  }
  const celsius = Math.floor((kelvin - 273.15) * 100) / 100;
  const fahrenheit = Math.floor((celsius * (9 / 5) + 32) * 100) / 100;
  const test = celsius + 1;
  //add
  return {
    celsius: celsius,
    fahrenheit: fahrenheit,
    kelvin: kelvin,
    test: test,
  }; //add
}

//add a new function xxxToOthers

/* How about check only one of value, when the values are related???? */
function isValueInvalid(name: string, value: number | "") {
  // function asserNever(value: never): never {
  //   throw new Error(`value should not exist ${value}`);
  // }
  if (value === undefined || value === "") {
    return false;
  }
  switch (name) {
    case "celsius":
      return value < -273.15 ? true : false;
    case "fahrenheit":
      return value < -459.67 ? true : false;
    case "kelvin":
      return value < 0 ? true : false;
    case "test":
      return value < -272.15 ? true : false;
    //add
    default:
      throw new Error(`Unexpected name: ${name}`);
    /* also works? difference? */
    //asserNever(name); //why???
  }
}

function TemperatureInput({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex-auto">
      <input
        className={` m-2 w-20 rounded border  border-black ${
          isValueInvalid(name, value ? value : "") ? "bg-red-500" : ""
        }`}
        type="number"
        value={value || value === 0 ? value : ""}
        onChange={onChange}
      />
      {name}
    </label>
  );
}
