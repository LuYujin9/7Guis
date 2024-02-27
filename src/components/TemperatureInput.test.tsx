import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemperatureInput } from "./TemperatureInput";

const user = userEvent.setup();
describe("TemperatureInput component", () => {
  const mockHandleChange = vi.fn();
  it("should called the onChange function when the input value changes", async () => {
    render(
      <TemperatureInput
        name={"celsius"}
        value={""}
        onChange={mockHandleChange}
        isValueInvalid={false}
      />
    );
    const input = screen.getByLabelText<HTMLInputElement>("celsius input");
    await user.type(input, "2");
    expect(mockHandleChange).toBeCalledTimes(1);
    await user.type(input, "0");
    expect(mockHandleChange).toBeCalledTimes(2);
  });
  it("should change the background color to red when the  isValueInvalid ist true", async () => {
    render(
      <TemperatureInput
        name={"celsius"}
        value={""}
        onChange={mockHandleChange}
        isValueInvalid={true}
      />
    );
    expect(screen.getByLabelText("celsius input")).toHaveClass("bg-red-500");
  });
});
