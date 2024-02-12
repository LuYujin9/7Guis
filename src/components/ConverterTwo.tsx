import { useEffect, useState } from "react";

type TemperatureData = {
  celsius: number | "";
  fahrenheit: number | "";
  kelvin: number | "";
};
//update the type

export function TemperatureConverter({ id }: { id: string }) {
  const [values, setByFahrenheit, setByCelsius, setBykelvin] = useSyncedState();
  const [inputCelsius, setInputCelsius] = useState<number | "">(""); //undefined , “” or null . 哪个好?
  const [inputFahrenheit, setInputFahrenheit] = useState<number | "">(""); //undefined , “” or null . 哪个好?
  const [inputKelvin, setInputKelvin] = useState<number | "">(""); //undefined , “” or null . 哪个好?
  const [inputTest, setInputTest] = useState<string | "">(""); //undefined , “” or null . 哪个好?
  //add a useState

  useEffect(() => {
    setByCelsius(inputCelsius);
  }, [inputCelsius]);

  useEffect(() => {
    setByFahrenheit(inputFahrenheit);
  }, [inputFahrenheit]);

  useEffect(() => {
    setBykelvin(inputKelvin);
  }, [inputKelvin]);

  //add a useEffect

  function handelCelsiusInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputCelsius(event.target.value ? Number(event.target.value) : "");
  }

  function handelFahrenheitInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputFahrenheit(event.target.value ? Number(event.target.value) : "");
  }

  function handelKelvinInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputKelvin(event.target.value ? Number(event.target.value) : "");
  }
  function handelTestInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    console.log(event.target.value);
    console.log(Number(inputValue));
    setInputTest(event.target.value);
  }

  //add a handelChangefunction

  return (
    <div
      className="flex flex-col w-[15rem] m-auto mt-3 rounded bg-blue-100 sm:flex-row sm:w-[25rem] sm:p-3 sm:bg-green-100 "
      id={id}
    >
      <label className="flex-auto">
        <input
          className=" m-2 w-20 rounded border border-black"
          type="number"
          value={values.celsius === "" ? "" : values.celsius}
          onChange={handelCelsiusInputChange}
        />
        Celsius
      </label>
      <p className="flex-auto m-auto ">=</p>
      <label className="flex-auto">
        <input
          className="m-2 w-20 rounded border border-black"
          type="number"
          value={values.fahrenheit === "" ? "" : values.fahrenheit}
          onChange={handelFahrenheitInputChange}
        />
        Fahrenheit
      </label>
      <p className="flex-auto m-auto ">=</p>
      <label className="flex-auto">
        <input
          className="m-2 w-20 rounded border border-black"
          type="number"
          value={values.kelvin === "" ? "" : values.kelvin}
          step={0.01}
          //value={inputKelvin === "" ? "" : inputKelvin}
          onChange={handelKelvinInputChange}
        />
        Kelvin
      </label>
      <label className="flex-auto">
        <input
          className="m-2 w-20 rounded border border-black"
          type="digit"
          step={0.01}
          value={inputTest}
          onChange={handelTestInputChange}
        />
        Test
      </label>
    </div>
  );
}

const useSyncedState = (): [
  TemperatureData,
  (newValue: "" | number) => void,
  (newValue: "" | number) => void,
  (newValue: "" | number) => void
  //add a function
] => {
  const [values, setValues] = useState<TemperatureData>({
    celsius: "",
    fahrenheit: "",
    kelvin: "",
  });
  //add

  const setByFahrenheit = (newValue: "" | number) => {
    const data = fahrenheitToOthers(newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
    });
  };

  const setByCelsius = (newValue: "" | number) => {
    const data = celsiusToOthers(newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
    });
  };

  const setBykelvin = (newValue: "" | number) => {
    const data = kelvinToOthers(newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
    });
  };
  //add a function
  return [values, setByFahrenheit, setByCelsius, setBykelvin]; //add a export
};

function celsiusToOthers(celsius: "" | number): TemperatureData {
  if (celsius === "") {
    return { celsius: "", fahrenheit: "", kelvin: "" };
  }
  const fahrenheit = Math.floor((celsius * (9 / 5) + 32) * 100) / 100;
  const kelvin = Math.floor((celsius - 273.15) * 100) / 100;
  //add
  return { celsius: celsius, fahrenheit: fahrenheit, kelvin: kelvin }; //add
}

function fahrenheitToOthers(fahrenheit: "" | number): TemperatureData {
  if (fahrenheit === "") {
    return { celsius: "", fahrenheit: "", kelvin: "" };
  }
  const celsius = Math.floor((fahrenheit - 32) * (5 / 9) * 100) / 100;
  const kelvin = Math.floor((celsius - 273.15) * 100) / 100;
  //add
  return { celsius: celsius, fahrenheit: fahrenheit, kelvin: kelvin }; //add
}

function kelvinToOthers(kelvin: "" | number): TemperatureData {
  if (kelvin === "") {
    return { celsius: "", fahrenheit: "", kelvin: "" };
  }
  const celsius = 5;
  Math.floor((kelvin + 273.1) * 100) / 100;
  const fahrenheit = Math.floor((celsius * (9 / 5) + 32) * 100) / 100;
  //add
  return { celsius: celsius, fahrenheit: fahrenheit, kelvin: kelvin }; //add
}

//add a new function xxxToOthers

// function checkInputFormat(input: string): boolean {
//   const regex = /^\d*\.?\d*$/;
//   return regex.test(input);
// }
