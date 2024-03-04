import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { TemperatureInput } from "./TemperatureInput";

describe("TemperatureInput component", () => {
  let mockHandleChange: () => void;
  let user: UserEvent;
  beforeEach(() => {
    mockHandleChange = vi.fn();
    user = userEvent.setup();
  });
  it("should called the onChange function when the input value changes", async () => {
    render(
      <TemperatureInput
        name={"celsius"}
        value={""}
        onChange={mockHandleChange}
        isValueInvalid={false}
      />
    );
    const input = screen.getByLabelText("celsius input");
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
