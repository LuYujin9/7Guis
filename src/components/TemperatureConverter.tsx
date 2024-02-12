import { useEffect, useState } from "react";

type TemperatureData = {
  celsius: string | "";
  fahrenheit: string | "";
  kelvin: string | "";
};
//the data construction not so good
//need a lot of checking
//change the date type two times
//too complex!!! is there a better way????!!!!

export function TemperatureConverter({ id }: { id: string }) {
  const [values, setByFahrenheit, setByCelsius, setBykelvin] = useSyncedState();
  const [inputCelsius, setInputCelsius] = useState<string>("");
  const [inputFahrenheit, setInputFahrenheit] = useState<string>("");
  const [inputKelvin, setInputKelvin] = useState<string>("");
  const [inputTest, setInputTest] = useState<string>("");
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

  function handelCelsiusInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const inputValue = event.target.value;
    if (isValidFormat(inputValue)) {
      setInputCelsius(inputValue);
    }
  }

  function handelFahrenheitInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    isValidFormat(event.target.value) && setInputFahrenheit(event.target.value);
  }

  function handelKelvinInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    isValidKelvinFormat(event.target.value) &&
      setInputKelvin(event.target.value);
  }

  function handelTestInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    isValidFormat(event.target.value) && setInputTest(event.target.value);
  }

  return (
    <div
      className="flex flex-col w-[15rem] m-auto mt-3 rounded bg-blue-100 sm:flex-row sm:w-[25rem] sm:p-3 sm:bg-green-100 "
      id={id}
    >
      <label className="flex-auto">
        <input
          className=" m-2 w-20 rounded border border-black"
          type="digit"
          step={0.01}
          value={values.celsius === "" ? "" : values.celsius}
          onChange={handelCelsiusInputChange}
        />
        Celsius
      </label>
      <p className="flex-auto m-auto ">=</p>
      <label className="flex-auto">
        <input
          className="m-2 w-20 rounded border border-black"
          type="digit"
          step={0.01}
          value={values.fahrenheit === "" ? "" : values.fahrenheit}
          onChange={handelFahrenheitInputChange}
        />
        Fahrenheit
      </label>
      <p className="flex-auto m-auto ">=</p>
      <label className="flex-auto">
        <input
          className="m-2 w-20 rounded border border-black"
          type="digit"
          step={0.01}
          value={values.kelvin === "" ? "" : values.kelvin}
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
  (newValue: string) => void,
  (newValue: string) => void,
  (newValue: string) => void
  //add a function
] => {
  const [values, setValues] = useState<TemperatureData>({
    celsius: "",
    fahrenheit: "",
    kelvin: "",
  });
  //add

  const setByCelsius = (newValue: string) => {
    if (newValue.endsWith(".")) {
      setValues({
        celsius: newValue,
        fahrenheit: values.fahrenheit,
        kelvin: values.kelvin,
      });
      return;
    }
    const data = celsiusToOthers(newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
    });
  };

  const setByFahrenheit = (newValue: string) => {
    if (newValue.endsWith(".")) {
      setValues({
        celsius: values.celsius,
        fahrenheit: newValue,
        kelvin: values.kelvin,
      });
      return;
    }
    const data = fahrenheitToOthers(newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
    });
  };

  const setBykelvin = (newValue: string) => {
    if (newValue.endsWith(".")) {
      setValues({
        celsius: values.celsius,
        fahrenheit: values.fahrenheit,
        kelvin: newValue,
      });
      return;
    }
    const data = kelvinToOthers(newValue);
    setValues({
      celsius: data.celsius,
      fahrenheit: data.fahrenheit,
      kelvin: data.kelvin,
    });
  };
  return [values, setByFahrenheit, setByCelsius, setBykelvin]; //add a export
};

function celsiusToOthers(celsius: string): TemperatureData {
  if (celsius === "") {
    return { celsius: "", fahrenheit: "", kelvin: "" };
  }
  const celsiusNumber = Number(celsius);
  const fahrenheitNumber =
    Math.floor((celsiusNumber * (9 / 5) + 32) * 100) / 100;
  const kelvinNumber = Math.floor((celsiusNumber - 273.15) * 100) / 100;
  return {
    celsius: celsius,
    fahrenheit: fahrenheitNumber.toString(),
    kelvin: kelvinNumber.toString(),
  };
}

function fahrenheitToOthers(fahrenheit: string): TemperatureData {
  if (fahrenheit === "") {
    return { celsius: "", fahrenheit: "", kelvin: "" };
  }
  const fahrenheitNumber = Number(fahrenheit);
  const celsiusNumber =
    Math.floor((fahrenheitNumber - 32) * (5 / 9) * 100) / 100;
  const kelvinNumber = Math.floor((fahrenheitNumber - 273.15) * 100) / 100;
  return {
    celsius: celsiusNumber.toString(),
    fahrenheit: fahrenheit,
    kelvin: kelvinNumber.toString(),
  };
}

function kelvinToOthers(kelvin: string): TemperatureData {
  if (kelvin === "") {
    return { celsius: "", fahrenheit: "", kelvin: "" };
  }
  const kelvinNumber = Number(kelvin);
  const celsiusNumber = Math.floor((kelvinNumber + 273.1) * 100) / 100;
  const fahrenheitNumber =
    Math.floor((celsiusNumber * (9 / 5) + 32) * 100) / 100;
  return {
    celsius: celsiusNumber.toString(),
    fahrenheit: fahrenheitNumber.toString(),
    kelvin: kelvin,
  };
}

//add a new function xxxToOthers

function isValidFormat(input: string): boolean {
  const regex = /^[-]?\d*(\.?\d{0,2})?$/;
  return regex.test(input);
}

function isValidKelvinFormat(input: string): boolean {
  const regex = /^\d*(\.?\d{0,2})?$/;
  return regex.test(input);
}
