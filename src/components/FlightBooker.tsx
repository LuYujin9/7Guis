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
    if (isReturnInputDisable(flightType)) {
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
      <input
        type="text"
        aria-label="return date"
        placeholder="DD/MM/YYYY"
        className={` m-2 rounded border  border-black disabled:bg-slate-200  disabled:text-slate-400 ${
          isDateValid(!returnDate ? "" : parseDate(returnDate))
            ? ""
            : "bg-red-500"
        }`}
        value={flightType === "return-flights" ? returnDate : outboundDate}
        disabled={isReturnInputDisable(flightType)}
        onChange={(e) => setReturnDate(e.target.value)}
      />
      <button
        type="submit"
        className="flex-auto m-2 w-20 bg-blue-300 text-gray-700 disabled:text-slate-400"
        aria-label="book the flight"
        disabled={isButtonDisabled(outboundDate, returnDate)}
        onClick={handleBook}
      >
        Book
      </button>
      <p aria-label="message">{message}</p>
    </div>
  );
}

function isReturnInputDisable(input: "one-way" | "return-flights"): boolean {
  switch (input) {
    case "return-flights":
      return false;
    case "one-way":
      return true;
    default:
      assertNever(input);
  }
}

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
  const regex = /^\d{1,2}.\d{1,2}.\d{4}$/;
  if (!regex.test(input)) {
    return null;
  }
  const match = input.match(/^([\d]*).([\d]*).([\d]*)/);
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
