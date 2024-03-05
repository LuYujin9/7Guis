import { describe, expect, it } from "vitest";
import {
  isButtonDisabled,
  parseDate,
  isDateValid,
  dateToString,
  FlightBooker,
  isDateBefore,
} from "./FlightBooker";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("FlightBooker component", () => {
  function renderFlightBooker() {
    const component = render(<FlightBooker />);
    return { component, user: userEvent.setup() } as const;
  }
  it("should create booking message for the one-way flight with correct date", async () => {
    const { user, component } = renderFlightBooker();
    const outboundDateInput = component.getByLabelText("outbound date");
    expect(component.getByLabelText("message")).toHaveTextContent("");
    await user.type(outboundDateInput, "30/12/2024");
    const button = component.getByRole("button");
    await user.click(button);
    expect(outboundDateInput).toHaveValue("30/12/2024");
    expect(component.getByLabelText("message")).toHaveTextContent(
      "You have booked an one way flight on 30 Dec 2024"
    );
  });
  it("should create a booking message for outbound and return flights with correct date", async () => {
    const { user, component } = renderFlightBooker();
    const flightTypeSelect = component.getByRole("combobox");
    const outboundDateInput = component.getByLabelText("outbound date");
    const returnDateInput = component.getByLabelText("return date");
    expect(component.getByLabelText("message")).toHaveTextContent("");
    await user.selectOptions(flightTypeSelect, "return-flights");
    await user.type(outboundDateInput, "18/12/2024");
    await user.type(returnDateInput, "30/12/2024");
    const button = component.getByRole("button");
    await user.click(button);
    expect(component.getByLabelText("message")).toHaveTextContent(
      "You have booked an outbound flight on 18 Dec 2024 and a return flight on 30 Dec 2024"
    );
  });
});

describe("parseDate", () => {
  it("should parse the correct date", () => {
    expect(parseDate("28/2/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 1, 28))
    );
    expect(parseDate("29/2/2000")).toStrictEqual(
      new Date(Date.UTC(2000, 1, 29))
    );
    expect(parseDate("31/1/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 0, 31))
    );
    expect(parseDate("31/5/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 4, 31))
    );
    expect(parseDate("31/7/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 6, 31))
    );
    expect(parseDate("31/8/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 7, 31))
    );
    expect(parseDate("31/12/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 11, 31))
    );
    expect(parseDate("1/10/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 9, 1))
    );
    expect(parseDate("31/12/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 11, 31))
    );
    expect(parseDate("31/10/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 9, 31))
    );
  });
  it("should parse the correct date, when there is a '0' before day and month", () => {
    expect(parseDate("02/03/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 2, 2))
    );
    expect(parseDate("02/12/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 11, 2))
    );
  });
  it("should parse the correct date, when there is not a '0' before day and month", () => {
    expect(parseDate("2/3/2023")).toStrictEqual(new Date(Date.UTC(2023, 2, 2)));
    expect(parseDate("30/10/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 9, 30))
    );
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
    expect(parseDate("28/2/2020")).toStrictEqual(
      new Date(Date.UTC(2020, 1, 28))
    );
    expect(parseDate("28/2/3004")).toStrictEqual(
      new Date(Date.UTC(3004, 1, 28))
    );
    expect(parseDate("28/2/2024")).toStrictEqual(
      new Date(Date.UTC(2024, 1, 28))
    );
    expect(parseDate("28/2/2021")).toStrictEqual(
      new Date(Date.UTC(2021, 1, 28))
    );
    expect(parseDate("28/2/3000")).toStrictEqual(
      new Date(Date.UTC(3000, 1, 28))
    );
    expect(parseDate("28/2/2023")).toStrictEqual(
      new Date(Date.UTC(2023, 1, 28))
    );
  });
  it("should parse the correct date, when 29/2 is in leap year", () => {
    expect(parseDate("29/2/2020")).toStrictEqual(
      new Date(Date.UTC(2020, 1, 29))
    );
    expect(parseDate("29/2/3004")).toStrictEqual(
      new Date(Date.UTC(3004, 1, 29))
    );
    expect(parseDate("29/2/2024")).toStrictEqual(
      new Date(Date.UTC(2024, 1, 29))
    );
  });
  it("should return null, when 29/2 is not in leap year", () => {
    expect(parseDate("29/2/2021")).toBeNull();
    expect(parseDate("29/2/3000")).toBeNull();
    expect(parseDate("29/2/2023")).toBeNull();
  });
});

describe("isButtonDisabled function", () => {
  const mockCurrentDate = new Date(Date.UTC(2024, 0, 30));
  it("should return true,if the flight type is 'one-way-flight', parsedReturnDate are undefined and parsedOutboundDate are null or undefined", () => {
    expect(
      isButtonDisabled("one-way-flight", null, undefined, mockCurrentDate)
    ).toBe(true);
  });
  it("should return false, if the flight type is 'one-way-flight', parsedReturnDate are undefined and parsedOutboundDate is a valid date", () => {
    expect(
      isButtonDisabled(
        "one-way-flight",
        new Date(Date.UTC(2024, 11, 12)),
        undefined,
        mockCurrentDate
      )
    ).toBe(false);
  });
  it("should return true, if the flight type is 'return-flights' and either parsedOutboundDate or parsedReturnDate are undefined or null", () => {
    expect(
      isButtonDisabled(
        "return-flights",
        undefined,
        new Date(Date.UTC(2024, 11, 12)),
        mockCurrentDate
      )
    ).toBe(true);
    expect(
      isButtonDisabled(
        "return-flights",
        new Date(Date.UTC(2024, 11, 12)),
        undefined,
        mockCurrentDate
      )
    ).toBe(true);
    expect(
      isButtonDisabled(
        "return-flights",
        null,
        new Date(Date.UTC(2024, 11, 12)),
        mockCurrentDate
      )
    ).toBe(true);
    expect(
      isButtonDisabled(
        "return-flights",
        new Date(Date.UTC(2024, 11, 12)),
        null,
        mockCurrentDate
      )
    ).toBe(true);
  });
  it("should return true, if the flight type is 'return-flights' and  parsedOutboundDate is after parsedReturnDate", () => {
    expect(
      isButtonDisabled(
        "return-flights",
        new Date(Date.UTC(2024, 11, 20)),
        new Date(Date.UTC(2024, 11, 12)),
        mockCurrentDate
      )
    ).toBe(true);
  });
  it("should return false, if the flight type is 'return-flights' and  parsedOutboundDate is the same day as parsedReturnDate", () => {
    expect(
      isButtonDisabled(
        "return-flights",
        new Date(Date.UTC(2024, 11, 12)),
        new Date(Date.UTC(2024, 11, 12)),
        mockCurrentDate
      )
    ).toBe(false);
  });
  it("should return false, if the flight type is 'return-flights' and  parsedOutboundDate is before parsedReturnDate and they are both valid", () => {
    expect(
      isButtonDisabled(
        "return-flights",
        new Date(Date.UTC(2024, 11, 12)),
        new Date(Date.UTC(2024, 11, 12)),
        mockCurrentDate
      )
    ).toBe(false);
  });
});

describe("isDateBefore function", () => {
  it("should return true, if parsedOutboundDate is after parsedReturnDate", () => {
    expect(
      isDateBefore(
        new Date(Date.UTC(2024, 11, 20)),
        new Date(Date.UTC(2024, 11, 12))
      )
    ).toBe(true);
  });
  it("should return false, if parsedOutboundDate is the same day as parsedReturnDate", () => {
    expect(
      isDateBefore(
        new Date(Date.UTC(2024, 11, 12)),
        new Date(Date.UTC(2024, 11, 12))
      )
    ).toBe(false);
  });
  it("should return false, if parsedOutboundDate is before day as parsedReturnDate", () => {
    expect(
      isDateBefore(
        new Date(Date.UTC(2024, 11, 11)),
        new Date(Date.UTC(2024, 11, 12))
      )
    ).toBe(false);
  });
});

describe("isDateValid function", () => {
  const mockCurrentDate = new Date(Date.UTC(2024, 0, 30));
  it("should return true if input is undefined", () => {
    expect(isDateValid(undefined, mockCurrentDate)).toBe(true);
  });
  it("should return true if input is later after the current date", () => {
    expect(isDateValid(new Date(Date.UTC(2024, 1, 21)), mockCurrentDate)).toBe(
      true
    );
  });
  it("should return false if input is the same as the current date", () => {
    expect(isDateValid(new Date(Date.UTC(2024, 0, 30)), mockCurrentDate)).toBe(
      false
    );
  });
  it("should return false if input is before the current date", () => {
    expect(isDateValid(new Date(Date.UTC(2024, 0, 19)), mockCurrentDate)).toBe(
      false
    );
  });
  it("should return false if input is null", () => {
    expect(isDateValid(null, mockCurrentDate)).toBe(false);
  });
});

describe("dateToString function", () => {
  it("should convert the date to string, and the format is DD.MM.YYY", () => {
    expect(dateToString(new Date(Date.UTC(2024, 11, 30)))).toStrictEqual(
      "30 Dec 2024"
    );
    expect(dateToString(new Date(Date.UTC(2024, 0, 1)))).toStrictEqual(
      "1 Jan 2024"
    );
  });
  it("should return null, when the input date is null ", () => {
    expect(dateToString(null)).toStrictEqual(null);
  });
});
