import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { DynamicButton } from "./DynamicButton";

describe("DynamicButton component", () => {
  it("Button component should render with correct text and trigger onClick function when clicked", async () => {
    const handleClick = vi.fn();
    render(
      <DynamicButton name="Create" onClick={handleClick} isDisabled={false} />
    );
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /Create/i });
    await user.click(button);
    expect(button).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalled();
  });
  it("should not trigger onClick function when isDisabled is true", async () => {
    const handleClick = vi.fn();
    render(
      <DynamicButton name="Create" onClick={handleClick} isDisabled={true} />
    );
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /Create/i });
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
  it("should render with red hover and focus style when isDeleteButton is true", async () => {
    const handleClick = vi.fn();
    render(
      <DynamicButton
        name="Create"
        onClick={handleClick}
        isDisabled={false}
        isDeleteButton={true}
      />
    );
    const button = screen.getByRole("button", { name: /Create/i });
    expect(button).toHaveClass("hover:bg-[#FE9191]");
    expect(button).toHaveClass("focus:bg-[#FEACAC]");
    expect(button).not.toHaveClass("hover:bg-[#DDE5DE]");
    expect(button).not.toHaveClass("focus:bg-[#C7DAC9]");
  });
  it("should render the notice message, when the button disabled", async () => {
    const handleClick = vi.fn();
    render(
      <DynamicButton
        name="Create"
        onClick={handleClick}
        isDisabled={true}
        isDeleteButton={true}
      />
    );
    expect(
      screen.getByText(/Please do something to enable the Create Button/i)
    ).toBeInTheDocument();
  });
  it("should not render the notice message, when the button enabled", async () => {
    const handleClick = vi.fn();
    const { queryByText } = render(
      <DynamicButton
        name="Create"
        onClick={handleClick}
        isDisabled={false}
        isDeleteButton={true}
      />
    );
    expect(queryByText(/Please do something to enable the Create Button/i))
      .toBeNull;
  });
});
