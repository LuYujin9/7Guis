import { describe, expect, it, test, vi } from "vitest";
import {
  isButtonDisabled,
  isLeapYear,
  parseDate,
  isDateValid,
  dateToString,
  FlightBooker,
  DateState,
} from "./FlightBooker";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

// Q2 import userEvent from "@testing-library/user-event";
// const user = userEvent.setup();
// await user.type(outboundDateInput, "30/12/2024");
// await user.click(button);

// test("hasReturnDate should return true when there is key returnDate", () => {
//   expect(
//     hasReturnDate({
//       flightType: "return-flights",
//       outboundDate: "12/12/2024",
//       returnDate: "11/50/23",
//     })
//   ).toBe(true);
//   expect(
//     hasReturnDate({
//       flightType: "one-way-flight",
//       outboundDate: "12/12/2024",
//     })
//   ).toBe(false);
// });

describe("FlightBooker component", () => {
  it("should create booking message for the one-way flight with correct date", async () => {
    render(<FlightBooker />);
    const outboundDateInput = screen.getByLabelText("outbound date");
    expect(screen.getByLabelText("message")).toHaveTextContent("");
    act(() =>
      fireEvent.change(outboundDateInput, { target: { value: "30/12/2024" } })
    );
    const button = screen.getByLabelText("book the flight");
    act(() => button.click());
    expect(screen.getByLabelText("message")).toHaveTextContent(
      "You have booked an one way flight on 30 Dec 2024"
    );
  });
  it("should create a booking message for outbound and return flights with correct date", () => {
    render(<FlightBooker />);
    const outboundDateInput = screen.getByLabelText("outbound date");
    const returnDateInput = screen.getByLabelText("return date");
    const flightTypeSelect = screen.getByRole("combobox");
    expect(screen.getByLabelText("message")).toHaveTextContent("");
    act(() => {
      fireEvent.change(flightTypeSelect, {
        target: { value: "return-flights" },
      });
      fireEvent.change(outboundDateInput, { target: { value: "18/12/2024" } });
      fireEvent.change(returnDateInput, { target: { value: "30/12/2024" } });
    });
    const button = screen.getByLabelText("book the flight");
    act(() => button.click());
    expect(screen.getByLabelText("message")).toHaveTextContent(
      "You have booked an outbound flight on 18 Dec 2024 and a return flight on 30 Dec 2024"
    );
  });
});

describe("parseDate", () => {
  it("should parse the correct date", () => {
    expect(parseDate("28/2/2023")).toStrictEqual(new Date("2023-2-28"));
    expect(parseDate("29/2/2000")).toStrictEqual(new Date("2000-2-29"));
    expect(parseDate("31/1/2023")).toStrictEqual(new Date("2023-1-31"));
    expect(parseDate("31/5/2023")).toStrictEqual(new Date("2023-5-31"));
    expect(parseDate("31/7/2023")).toStrictEqual(new Date("2023-7-31"));
    expect(parseDate("31/8/2023")).toStrictEqual(new Date("2023-8-31"));
    expect(parseDate("31/10/2023")).toStrictEqual(new Date("2023-10-31"));
    expect(parseDate("31/12/2023")).toStrictEqual(new Date("2023-12-31"));
  });
  it("should parse the correct date, when there is a '0' before day and month", () => {
    expect(parseDate("02/03/2023")).toStrictEqual(new Date("2023-3-2"));
    expect(parseDate("02/12/2023")).toStrictEqual(new Date("2023-12-2"));
  });
  it("should parse the correct date, when there is not a '0' before day and month", () => {
    expect(parseDate("2/3/2023")).toStrictEqual(new Date("2023-3-2"));
    expect(parseDate("30/10/2023")).toStrictEqual(new Date("2023-10-30"));
  });
  it("should return null, when the input is not a date", () => {
    expect(parseDate("222/32/2023")).toBeNull();
    expect(parseDate("22 023")).toBeNull();
    expect(parseDate("-12/20")).toBeNull();
    expect(parseDate("32/12/2024")).toBeNull();
    expect(parseDate("12/13/2024")).toBeNull();
    expect(parseDate("12/12/20241")).toBeNull();
    expect(parseDate("12/0/2024")).toBeNull();
    expect(parseDate("0/0/2024")).toBeNull();
  });
  it("should return null, when a day does not exist in some months", () => {
    expect(parseDate("29/02/2001")).toBeNull();
    expect(parseDate("31/4/2024")).toBeNull();
    expect(parseDate("31/6/2024")).toBeNull();
    expect(parseDate("31/9/2024")).toBeNull();
    expect(parseDate("31/11/2024")).toBeNull();
  });
  it("should parse the correct date, when 28/2 is in every year", () => {
    expect(parseDate("28/2/2020")).toStrictEqual(new Date("2020-2-28"));
    expect(parseDate("28/2/3004")).toStrictEqual(new Date("3004-2-28"));
    expect(parseDate("28/2/2024")).toStrictEqual(new Date("2024-2-28"));
    expect(parseDate("28/2/2021")).toStrictEqual(new Date("2021-2-28"));
    expect(parseDate("28/2/3000")).toStrictEqual(new Date("3000-2-28"));
    expect(parseDate("28/2/2023")).toStrictEqual(new Date("2023-2-28"));
  });
  it("should parse the correct date, when 29/2 is in leap year", () => {
    expect(parseDate("29/2/2020")).toStrictEqual(new Date("2020-2-29"));
    expect(parseDate("29/2/3004")).toStrictEqual(new Date("3004-2-29"));
    expect(parseDate("29/2/2024")).toStrictEqual(new Date("2024-2-29"));
  });
  it("should return null, when 29/2 is not in leap year", () => {
    expect(parseDate("29/2/2021")).toBeNull();
    expect(parseDate("29/2/3000")).toBeNull();
    expect(parseDate("29/2/2023")).toBeNull();
  });
});

test("isLeapYear return the correct value", () => {
  expect(isLeapYear(1996)).toBe(true);
  expect(isLeapYear(1995)).toBe(false);
  expect(isLeapYear(2000)).toBe(true);
  expect(isLeapYear(1900)).toBe(false);
});

describe("isButtonDisabled function", () => {
  const currentDate = new Date("2024-2-20");
  vi.useFakeTimers();
  vi.setSystemTime(currentDate);
  it("should return true if either outboundDate or returnDate is empty", () => {
    //  const state:DateState= {
    //     flightType: "one-way-flight",
    //     outboundDate: ""
    //   }
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "",
        returnDate: "12/12/2024",
      })
    ).toBe(true);
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "12/12/2024",
        returnDate: "",
      })
    ).toBe(true);
  });
  it("should return true if either outboundDate or returnDate is not a date", () => {
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "11/50/23",
        returnDate: "12/12/2024",
      })
    ).toBe(true);
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "12/12/2024",
        returnDate: "11/50/23",
      })
    ).toBe(true);
  });
  it("should return true if outboundDate is after returnDate", () => {
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "12/12/2024",
        returnDate: "1/12/2024",
      })
    ).toBe(true);
  });
  it("should return false if both dates are valid and outboundDate is before returnDate", () => {
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "12/12/2024",
        returnDate: "30/12/2024",
      })
    ).toBe(false);
  });
  it("should return true if both dates are valid and outboundDate is the same as returnDate", () => {
    expect(
      isButtonDisabled({
        flightType: "return-flights",
        outboundDate: "30/10/2038",
        returnDate: "30/10/2038",
      })
    ).toBe(false);
  });
});

describe("isDateValid function", () => {
  const currentDate = new Date("2024-2-20");
  vi.useFakeTimers();
  vi.setSystemTime(currentDate);
  it("should return true if input is empty string", () => {
    expect(isDateValid("")).toBe(true);
  });
  it("should return true if input is later after the current date", () => {
    expect(isDateValid(new Date("2024-2-21"))).toBe(true);
  });
  it("should return false if input is the same as the current date", () => {
    expect(isDateValid(new Date("2024-2-20"))).toBe(false);
  });
  it("should return false if input is before the current date", () => {
    expect(isDateValid(new Date("2024-2-19"))).toBe(false);
  });
  it("should return false if input is null", () => {
    expect(isDateValid(null)).toBe(false);
  });
});

describe("dateToString function", () => {
  it("should convert the date to string, and the format is DD.MM.YYY", () => {
    expect(dateToString(new Date("2024-12-30"))).toStrictEqual("30 Dec 2024");
    expect(dateToString(new Date("2024-1-1"))).toStrictEqual("1 Jan 2024");
  });
  it("should return null, when the input date is null ", () => {
    expect(dateToString(null)).toStrictEqual(null);
  });
});
