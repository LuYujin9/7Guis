import { describe, expect, it } from "vitest";
import { parseDate } from "./FlightBookerTwo";

describe("parseDate", () => {
  it("returns the correct date", () => {
    const date = parseDate("23.10.2023");
    expect(date).toEqual("2023-10-23");
  });
  it("returns the correct date, when there is a '0' before day and month", () => {
    const date = parseDate("02.03.2023");
    expect(date).toEqual("2023-3-2");
  });
  it("returns the correct date, when there isn't a '0' before day and month", () => {
    const date = parseDate("2.3.2023");
    expect(date).toEqual("2023-3-2");
  });
  it("returns '', when the input is not a date", () => {
    const dateOne = parseDate("222.32.2023");
    const dateTwo = parseDate("22 023");
    const dateThree = parseDate("-12.20");
    expect(dateOne).toBeNull();
    expect(dateTwo).toBeNull();
    expect(dateThree).toBeNull();
  });
});
