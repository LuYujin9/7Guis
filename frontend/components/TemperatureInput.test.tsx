import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemperatureInput } from "./TemperatureInput";

describe("TemperatureInput component", () => {
  it("should called the onChange function when the input value changes", async () => {
    const mockHandleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TemperatureInput
        name={"celsius"}
        value={""}
        onChange={mockHandleChange}
        isValueInvalid={false}
      />
    );
    const input = screen.getByRole("textbox", { name: /celsius input/i });
    await user.type(input, "2");
    expect(mockHandleChange).toBeCalledTimes(1);
    await user.type(input, "0");
    expect(mockHandleChange).toBeCalledTimes(2);
  });
  it("should change the background color to red when the  isValueInvalid ist true", async () => {
    const mockHandleChange = vi.fn();
    render(
      <TemperatureInput
        name={"celsius"}
        value={""}
        onChange={mockHandleChange}
        isValueInvalid={true}
      />
    );
    expect(screen.getByRole("textbox", { name: /celsius input/i })).toHaveClass(
      "bg-red-500"
    );
  });
});
