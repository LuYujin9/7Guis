import { useState } from "react";
import { assertNever } from "../utils/assertNever";

export function FlightBooker() {
  const [flightType, setFlightType] = useState<"one-way" | "return-flights">(
    "one-way"
  );
  const [outboundDate, setOutboundDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "return-flights":
        setFlightType("return-flights");
        return;
      case "one-way":
        setFlightType("one-way");
        setReturnDate(outboundDate);
        return;
      default:
        throw new Error(`value should not exist ${event.target.value}`);
    }
  }

  function handleOutboundDateChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.value) {
      setOutboundDate("");
      return;
    }
    setOutboundDate(event.target.value);
    if (!isReturnInputEnabled(flightType)) {
      setReturnDate(event.target.value);
    }
  }

  function handleBook() {
    const outboundDateString = dateToString(parseDate(outboundDate));
    if (flightType === "one-way" && outboundDateString) {
      setMessage(
        `You have booked a ${flightType} flight on ${outboundDateString}`
      );
      return;
    }
    const returnDateString = dateToString(parseDate(returnDate));
    if (flightType === "return-flights" && returnDateString) {
      setMessage(
        `You have booked a outbound flight on ${outboundDateString} and return flight on ${returnDateString}`
      );
    }
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
          <option aria-label="one way flight" value="one-way">
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
                isDateValid(!outboundDate ? "" : parseDate(outboundDate))
                  ? ""
                  : "bg-red-500"
              }`}
              value={outboundDate}
              onChange={handleOutboundDateChange}
            />
          </label>
          <div
            className={`text-red-600 text-xs ${
              !isDateValid(!outboundDate ? "" : parseDate(outboundDate))
                ? "visible"
                : "invisible"
            }`}
          >
            The date is invalid. The format is DD/MM/YY and should be later than
            today.
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
                isDateValid(!returnDate ? "" : parseDate(returnDate))
                  ? ""
                  : "bg-red-500"
              }`}
              value={
                flightType === "return-flights" ? returnDate : outboundDate
              }
              disabled={!isReturnInputEnabled(flightType)}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>
          <div
            className={`text-red-600 text-xs ${
              isReturnInputEnabled(flightType) &&
              !isDateValid(!returnDate ? "" : parseDate(returnDate))
                ? "visible"
                : "invisible"
            }`}
          >
            The date is invalid. The format is DD/MM/YY and should not be
            earlier than outbound flight.
          </div>
        </div>
        <button
          type="submit"
          className="flex-auto h-12 border-2 rounded-[5px] bg-[#F5F5F5]  border-black shadow-[5px_5px_4px_0px]
        shadow-gray-400 text-gray-700 disabled:text-slate-400 hover:bg-[#DDE5DE] focus:bg-[#C7DAC9]"
          aria-label="book the flight"
          disabled={isButtonDisabled(outboundDate, returnDate)}
          onClick={handleBook}
        >
          Book
        </button>
      </div>
      <div aria-label="message">{message}</div>
    </div>
  );
}

function isReturnInputEnabled(input: "one-way" | "return-flights"): boolean {
  return input === "return-flights";
} //确保其他情况都不会enable

export function isButtonDisabled(
  outboundDate: string,
  returnDate: string
): boolean {
  const parsedOutboundDate = parseDate(outboundDate);
  const parsedReturnDate = parseDate(returnDate);
  return (
    !isDateValid(parsedOutboundDate) ||
    !isDateValid(parsedReturnDate) ||
    parsedOutboundDate === null ||
    parsedReturnDate === null ||
    parsedOutboundDate.getTime() > parsedReturnDate.getTime()
  );
}

export function isDateValid(input: "" | Date | null): boolean {
  switch (input) {
    case "":
      return true;
    case null:
      return false;
    default:
      const currentDateNumber = new Date().getTime();
      return input.getTime() > currentDateNumber;
  }
}

export function parseDate(input: string): Date | null {
  const match = input.match(/^(\d{1,2}).(\d{1,2}).(\d{4})/);
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
