import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TemperatureConverter } from "./TemperatureConverter";
import { userEvent } from "@testing-library/user-event";
import { Units } from "../pages/TemperatureConverterPage";

describe("TemperatureConverter screen", () => {
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
        return Number(((fahrenheit - 32) * (5 / 9)).toFixed(2));
      },
      fromCelsius: (celsius) => {
        return Number((celsius * (9 / 5) + 32).toFixed(2));
      },
    },
    {
      name: "kelvin",
      toCelsius: (kelvin) => {
        return Number((kelvin - 273.15).toFixed(2));
      },
      fromCelsius: (celsius) => {
        return Number((celsius + 273.15).toFixed(2));
      },
    },
  ] satisfies Units;
  function renderTemperatureConverter() {
    const user = userEvent.setup();
    const renderer = render(<TemperatureConverter units={units} />);
    return { renderer, user } as const;
  }
  it("should render with different units", () => {
    renderTemperatureConverter();
    const twoUnits = [
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
          return Number(((fahrenheit - 32) * (5 / 9)).toFixed(2));
        },
        fromCelsius: (celsius) => {
          return Number((celsius * (9 / 5) + 32).toFixed(2));
        },
      },
    ] satisfies Units;
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
    expect(screen.getByLabelText("celsius")).toBeInTheDocument();
    expect(screen.getByLabelText("fahrenheit")).toBeInTheDocument();
    expect(screen.getByLabelText("kelvin")).toBeInTheDocument();
    render(<TemperatureConverter units={twoUnits} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(5);
    expect(screen.getAllByLabelText("celsius")).toHaveLength(2);
    expect(screen.getAllByLabelText("fahrenheit")).toHaveLength(2);
    expect(screen.getAllByLabelText("kelvin")).toHaveLength(1);
  });
  it("should update the other inputs with correct converted values, when a number is entered in an input", async () => {
    const { user } = renderTemperatureConverter();
    const celsiusInput = screen.getByLabelText("celsius input");
    const fahrenheitInput = screen.getByLabelText("fahrenheit input");
    const kelvinInput = screen.getByLabelText("kelvin input");
    await user.type(celsiusInput, "0");
    expect(fahrenheitInput).toHaveValue("32");
    expect(kelvinInput).toHaveValue("273.15");
    await user.clear(celsiusInput);
    await user.type(celsiusInput, "-10.5");
    expect.soft(fahrenheitInput).toHaveValue("13.1");
    expect(kelvinInput).toHaveValue("262.65");
    await user.clear(celsiusInput);
    await user.type(celsiusInput, "200");
    expect(fahrenheitInput).toHaveValue("392");
    expect(kelvinInput).toHaveValue("473.15");
    await user.clear(fahrenheitInput);
    await user.type(fahrenheitInput, "0");
    expect(celsiusInput).toHaveValue("-17.78");
    expect(kelvinInput).toHaveValue("255.37");
    await user.clear(fahrenheitInput);
    await user.type(fahrenheitInput, "-10.5");
    expect(celsiusInput).toHaveValue("-23.61");
    expect(kelvinInput).toHaveValue("249.54");
    await user.clear(fahrenheitInput);
    await user.type(fahrenheitInput, "200");
    expect(celsiusInput).toHaveValue("93.33");
    expect(kelvinInput).toHaveValue("366.48");
  });
  it("should not update the other inputs when an invalid value is entered in an input", async () => {
    const { user } = renderTemperatureConverter();
    const celsiusInput = screen.getByLabelText("celsius input");
    const fahrenheitInput = screen.getByLabelText("fahrenheit input");
    const kelvinInput = screen.getByLabelText(
      "kelvin input"
    ) as HTMLInputElement;
    await user.type(celsiusInput, "5");
    expect(celsiusInput).toHaveValue("5");
    expect(fahrenheitInput).toHaveValue("41");
    expect(kelvinInput).toHaveValue("278.15");
    await user.type(celsiusInput, ".");
    expect(celsiusInput).toHaveValue("5.");
    expect(fahrenheitInput).toHaveValue("41");
    expect(kelvinInput).toHaveValue("278.15");
    await user.type(celsiusInput, "5");
    expect(celsiusInput).toHaveValue("5.5");
    expect(fahrenheitInput).toHaveValue("41.9");
    expect(kelvinInput).toHaveValue("278.65");
    await user.type(celsiusInput, "sasda");
    expect(celsiusInput).toHaveValue("5.5sasda");
    expect(fahrenheitInput).toHaveValue("41.9");
    expect(kelvinInput).toHaveValue("278.65");
    await user.type(fahrenheitInput, "5");
    expect(celsiusInput).toHaveValue("5.53");
    expect(fahrenheitInput).toHaveValue("41.95");
    expect(kelvinInput).toHaveValue("278.68");
    await user.type(fahrenheitInput, ".aa");
    expect(celsiusInput).toHaveValue("5.53");
    expect(fahrenheitInput).toHaveValue("41.95.aa");
    expect(kelvinInput).toHaveValue("278.68");
  });
  it("should change inputs background color to red when converted value to celsius is below -273.15", async () => {
    const { user } = renderTemperatureConverter();
    const celsiusInput = screen.getByLabelText("celsius input");
    const fahrenheitInput = screen.getByLabelText("fahrenheit input");
    const kelvinInput = screen.getByLabelText("kelvin input");
    await user.type(celsiusInput, "-273.16");
    expect(celsiusInput).toHaveClass("bg-red-500");
    await user.clear(celsiusInput);
    await user.type(fahrenheitInput, "-459.69");
    expect(fahrenheitInput).toHaveClass("bg-red-500");
    await user.clear(fahrenheitInput);
    await user.type(kelvinInput, "-0.01");
    expect(kelvinInput).toHaveClass("bg-red-500");
    expect(screen.getByText("The value is invalid")).toBeInTheDocument();
  });
});
