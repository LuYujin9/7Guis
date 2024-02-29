import { useState } from "react";

export type DateState =
  | { flightType: "one-way-flight"; outboundDate: string }
  | { flightType: "return-flights"; outboundDate: string; returnDate: string };
// export type DateState = { flightType: "one-way-flight"| "return-flights"; outboundDate: string; returnDate?: string };

export function FlightBooker() {
  const [dateState, setDateState] = useState<DateState>({
    flightType: "one-way-flight",
    outboundDate: "",
  });
  const [message, setMessage] = useState<string>("");

  const parsedOutboundDate = dateState.outboundDate
    ? parseDate(dateState.outboundDate)
    : undefined;

  const parsedReturnDate =
    dateState.flightType === "return-flights" && dateState.returnDate !== ""
      ? parseDate(dateState.returnDate)
      : undefined;

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "one-way-flight":
        setDateState({
          flightType: "one-way-flight",
          outboundDate: dateState.outboundDate,
        });
        return;
      case "return-flights":
        setDateState({
          ...dateState,
          flightType: "return-flights",
          returnDate: dateState.outboundDate,
        });
        return;
      default:
        throw new Error(`value should not exist ${event.target.value}`);
    }
  }

  function handleBook() {
    const outboundDateString = dateToString(parsedOutboundDate ?? null);
    if (dateState.flightType === "one-way-flight") {
      setMessage(`You have booked an one way flight on ${outboundDateString}`);
      return;
    }
    if (dateState.flightType === "return-flights") {
      const returnDateString = dateToString(parsedReturnDate ?? null);
      setMessage(
        `You have booked an outbound flight on ${outboundDateString} and a return flight on ${returnDateString}`
      );
    }
  }

  function isReturnDateValid() {
    return (
      (isDateValid(parsedReturnDate) || parsedReturnDate === undefined) &&
      (!isDateBefore(parsedOutboundDate, parsedReturnDate) ||
        dateState.flightType === "one-way-flight")
    );
  }

  return (
    <div>
      <div className="grid grid-flow-row content-between w-[600px] h-[400px] rounded-[10px] m-auto p-7 bg-[#CDD3CE]">
        <select
          className="border border-black"
          name="flightType"
          id="flightType"
          onChange={handleFlightTypeChange}
        >
          <option aria-label="one way flight" value="one-way-flight">
            one-way-flight
          </option>
          <option aria-label="return flights" value="return-flights">
            return flights
          </option>
        </select>
        <div className="">
          <label>
            Outbound flight:
            <input
              type="text"
              aria-label="outbound date"
              placeholder="DD/MM/YYYY"
              className={` m-2 rounded border  border-black ${
                dateState.outboundDate &&
                !isDateValid(parsedOutboundDate) &&
                "bg-red-500"
              }`}
              value={dateState.outboundDate}
              onChange={(e) => {
                setDateState({
                  ...dateState,
                  outboundDate: e.target.value ?? "",
                });
              }}
            />
          </label>
          <div
            className={`text-red-600 text-xs ${
              isDateValid(parsedOutboundDate) && "invisible"
            }`}
          >
            The date is invalid. The format is DD/MM/YY and the date should be
            later than today.
          </div>
        </div>
        <div>
          <label>
            Return flight:
            <input
              type="text"
              aria-label="return date"
              placeholder="DD/MM/YYYY"
              className={`m-2 rounded border  border-black disabled:bg-slate-200  disabled:text-slate-400 ${
                !isReturnDateValid() && "bg-red-500"
              }`}
              value={
                dateState.flightType === "return-flights"
                  ? dateState.returnDate
                  : ""
              }
              disabled={dateState.flightType !== "return-flights"}
              onChange={(e) => {
                if (dateState.flightType === "return-flights")
                  setDateState({
                    ...dateState,
                    returnDate: !e.target.value ? "" : e.target.value,
                  });
              }}
            />
          </label>
          <div
            className={`text-red-600 text-xs ${
              isReturnDateValid() && "invisible"
            }`}
          >
            The date is invalid. The format is DD/MM/YY and the Date should not
            be earlier than outbound flight.
          </div>
        </div>
        <button
          type="submit"
          className="flex-auto h-12 border-2 rounded-[5px] bg-[#F5F5F5]  border-black shadow-[5px_5px_4px_0px]
        shadow-gray-400 text-gray-700 disabled:text-slate-400 hover:bg-[#DDE5DE] focus:bg-[#C7DAC9]"
          aria-label="book the flight"
          disabled={isButtonDisabled(
            dateState.flightType,
            parsedOutboundDate,
            parsedReturnDate
          )}
          onClick={handleBook}
        >
          Book
        </button>
      </div>
      <div aria-label="message">{message}</div>
    </div>
  );
}

export function isButtonDisabled(
  flightType: "one-way-flight" | "return-flights",
  parsedOutboundDate: Date | null | undefined,
  parsedReturnDate: Date | null | undefined
): boolean {
  if (flightType === "one-way-flight") {
    return parsedOutboundDate === undefined
      ? true
      : !isDateValid(parsedOutboundDate);
  }
  return (
    !isDateValid(parsedOutboundDate) ||
    !isDateValid(parsedReturnDate) ||
    isDateBefore(parsedOutboundDate, parsedReturnDate)
  );
}

export function isDateValid(input: undefined | Date | null): boolean {
  switch (input) {
    case undefined:
      return true;
    case null:
      return false;
    default:
      const currentDateNumber = new Date();
      return isDateBefore(input, currentDateNumber);
  }
}

export function isDateBefore(
  dateOne: Date | null | undefined,
  dateTwo: Date | null | undefined
) {
  if (dateOne && dateTwo) {
    return dateOne.getTime() > dateTwo.getTime();
  }
  return true;
}

export function parseDate(input: string): Date | null {
  const match = input.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
  if (!match) {
    return null;
  }
  const lunarMonth = [4, 6, 9, 11];
  const year = Number(match[3]);
  const month = Number(match[2]);
  const day = Number(match[1]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  if (month === 2 && isLeapYear(year) && day > 29) {
    return null;
  }
  if (month === 2 && !isLeapYear(year) && day > 28) {
    return null;
  }
  if (lunarMonth.includes(month) && day > 30) {
    return null;
  }
  const formatDate = year + "-" + month + "-" + day;
  return new Date(formatDate);
}

export function isLeapYear(input: number) {
  if ((input % 100 === 0 && input % 400 !== 0) || input % 4 !== 0) {
    return false;
  }
  return true;
}

export function dateToString(date: Date | null) {
  if (date === null) {
    return null;
  }
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return day + " " + month + " " + year;
}
