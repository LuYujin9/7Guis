import { describe, expect, it, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Timer, calculatePercentage } from "./Timer";

describe("Timer component", () => {
  it("Timer component should render correct", () => {
    render(<Timer />);
    expect(screen.getByText(/^Elapsed Time:/)).toHaveTextContent(
      "Elapsed Time:0s"
    );
    const timerBlock = screen.getByLabelText("Block to show the elapsed time");
    const width = timerBlock.style.width;
    expect(width).toBe("0px");
    const Paragraph = screen.getByLabelText("Paragraph to show the duration");
    expect(Paragraph).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Duration:" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });
  it("should reset the elapsed time by clicking reset button", async () => {
    render(<Timer />);
    const button = screen.getByRole("button", { name: "Reset" });
    button.click();
    expect(screen.getByText(/^Elapsed Time:/)).toHaveTextContent(
      "Elapsed Time:0s"
    );
  });
  it("should set the duration by input", async () => {
    render(<Timer />);
    const input = screen.getByRole("slider", { name: "Duration:" });
    fireEvent.change(input, { target: { value: "60" } });
    const paragraph = screen.getByLabelText("Paragraph to show the duration");
    expect(paragraph).toHaveTextContent("6s");
  });
  it("should stop the timer after elapsed time greater as duration", async () => {
    render(<Timer />);
    vi.useFakeTimers();
    const elapsedTimeParagraph = screen.getByText(/^Elapsed Time:/);
    const input = screen.getByRole("slider", { name: "Duration:" });
    const timerBlock = screen.getByLabelText("Block to show the elapsed time");
    fireEvent.change(input, { target: { value: "60" } });
    await vi.advanceTimersByTimeAsync(3000);
    expect(elapsedTimeParagraph).toHaveTextContent("Elapsed Time:3s");
    await vi.advanceTimersByTimeAsync(3000);
    const width = timerBlock.style.width;
    expect(width).toBe("100%");
    expect(elapsedTimeParagraph).toHaveTextContent("Elapsed Time:6s");
    await vi.advanceTimersByTimeAsync(3000);
    const widthAfterStop = timerBlock.style.width;
    expect(widthAfterStop).toBe("100%");
  });
});

test.each([
  { a: 1, b: 1, expected: "100%" },
  { a: 0, b: 2, expected: "0" },
  { a: 2, b: 0, expected: "0" },
  { a: -1, b: 2, expected: "-50%" },
  { a: 2, b: -1, expected: "-200%" },
])(
  "calculatePercentage function should return the right value",
  ({ a, b, expected }) => {
    expect(calculatePercentage(a, b)).toBe(expected);
  }
);
