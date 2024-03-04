import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { DynamicButton } from "./DynamicButton";

describe("DynamicButton component", () => {
  let handleClick: () => void;
  let user: UserEvent;
  beforeEach(() => {
    handleClick = vi.fn();
    user = userEvent.setup();
  });
  it("Button component should render with correct text and trigger onClick function when clicked", async () => {
    render(
      <DynamicButton name="Create" onClick={handleClick} isDisabled={false} />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Create");
    await user.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
  it("should not trigger onClick function when isDisabled is true", async () => {
    render(
      <DynamicButton name="Create" onClick={handleClick} isDisabled={true} />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Create");
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
  it("should render with red hover and focus style when isDeleteButton is true", async () => {
    render(
      <DynamicButton
        name="Create"
        onClick={handleClick}
        isDisabled={false}
        isDeleteButton={true}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-[#FE9191]");
    expect(button).toHaveClass("focus:bg-[#FEACAC]");
    expect(button).not.toHaveClass("hover:bg-[#DDE5DE]");
    expect(button).not.toHaveClass("focus:bg-[#C7DAC9]");
  });
  it("should render the notice message, when the button disabled", async () => {
    render(
      <DynamicButton
        name="Create"
        onClick={handleClick}
        isDisabled={true}
        isDeleteButton={true}
      />
    );
    expect(
      screen.getByText("Please do something to enable the Create Button")
    ).toBeInTheDocument();
  });
  it("should not render the notice message, when the button enabled", async () => {
    render(
      <DynamicButton
        name="Create"
        onClick={handleClick}
        isDisabled={false}
        isDeleteButton={true}
      />
    );
    expect(
      screen.queryByText("Please do something to enable the Create Button")
    ).toBeNull;
  });
});
