import { describe, expect, it, test } from "vitest";
import { isLeapYear, parseDate } from "./FlightBooker";

describe("parseDate", () => {
  it("returns the correct date", () => {
    expect(parseDate("28.2.2023")).toStrictEqual(new Date("2023-2-28"));
    expect(parseDate("29.2.2000")).toStrictEqual(new Date("2000-2-29"));
    expect(parseDate("31.1.2023")).toStrictEqual(new Date("2023-1-31"));
    expect(parseDate("31.5.2023")).toStrictEqual(new Date("2023-5-31"));
    expect(parseDate("31.7.2023")).toStrictEqual(new Date("2023-7-31"));
    expect(parseDate("31.8.2023")).toStrictEqual(new Date("2023-8-31"));
    expect(parseDate("31.10.2023")).toStrictEqual(new Date("2023-10-31"));
    expect(parseDate("31.12.2023")).toStrictEqual(new Date("2023-12-31"));
  });
  it("returns the correct date, when there is a '0' before day and month", () => {
    const date = parseDate("02.03.2023");
    const expectDate = new Date("2023-3-2");
    expect(date).toStrictEqual(expectDate);
  });
  it("returns the correct date, when there is not a '0' before day and month", () => {
    const date = parseDate("2.3.2023");
    const expectDate = new Date("2023-3-2");
    expect(date).toStrictEqual(expectDate);
  });
  it("returns null, when the input is not a date", () => {
    expect(parseDate("222.32.2023")).toBeNull();
    expect(parseDate("22 023")).toBeNull();
    expect(parseDate("-12.20")).toBeNull();
    expect(parseDate("32.12.2024")).toBeNull();
    expect(parseDate("12.13.2024")).toBeNull();
    expect(parseDate("12.0.2024")).toBeNull();
    expect(parseDate("0.0.2024")).toBeNull();
  });
  it("returns null, when a day does not exist in some months", () => {
    expect(parseDate("29.02.2001")).toBeNull();
    expect(parseDate("31.4.2024")).toBeNull();
    expect(parseDate("31.6.2024")).toBeNull();
    expect(parseDate("31.9.2024")).toBeNull();
    expect(parseDate("31.11.2024")).toBeNull();
  });
});

test("isLeapYear return the right value", () => {
  expect(isLeapYear(1996)).toBeTruthy();
  expect(isLeapYear(1995)).not.toBeTruthy();
  expect(isLeapYear(2000)).toBeTruthy();
  expect(isLeapYear(1900)).not.toBeTruthy();
});
