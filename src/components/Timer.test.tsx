import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import { Timer, calculatePercentage } from "./Timer";

test("renders Timer component", () => {
  render(<Timer />);
  expect(screen.getByText(/^Elapsed Time:/)).toHaveTextContent(
    "Elapsed Time:0s"
  );
  const timerBlock = screen.getByLabelText("Block to show the elapsed time");
  const width = timerBlock.style.width;
  expect(width).toBe("0px");
  const Paragraph = screen.getByLabelText("Paragraph to show the duration");
  expect(Paragraph).toBeInTheDocument();
  expect(screen.getByRole("slider", { name: "Duration:" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
});

test("rests the elapsed time by clicking reset button", async () => {
  render(<Timer />);
  const button = screen.getByRole("button", { name: "Reset" });
  userEvent.click(button);
  // button.click()
  expect(screen.getByText(/^Elapsed Time:/)).toHaveTextContent(
    "Elapsed Time:0s"
  );
});

test("sets the duration by input", async () => {
  render(<Timer />);
  const input = screen.getByRole("slider", { name: "Duration:" });
  fireEvent.change(input, { target: { value: "60" } });
  const paragraph = screen.getByLabelText("Paragraph to show the duration");
  expect(paragraph).toHaveTextContent("6s");
});

test("stops the timer after elapsed time greater as duration", async () => {
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

test("calculatePercentage return the right value", () => {
  expect(calculatePercentage(1, 0)).toBe("0");
  expect(calculatePercentage(0, 1)).toBe("0");
  expect(calculatePercentage(1, 2)).toBe("50%");
});
