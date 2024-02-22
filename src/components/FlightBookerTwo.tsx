import { useState } from "react";
import { assertNever } from "../utils/assertNever";

export function FlightBookerTwo() {
  const [flightType, setFlightType] = useState<"one-way" | "return">("one-way");
  const [outboundDate, setOutboundDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "return":
        setFlightType("return");
        return;
      case "one-way":
        setFlightType("one-way");
        setReturnDate(outboundDate); //keep it? because without it, there must be more lines to check isButtonDisabled
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
    const message = `You have booked a ${flightType} flight on ${outboundDate} ${
      flightType === "return" ? `and ${returnDate}` : ""
    } `;
    setMessage(message);
  }

  return (
    <div>
      <select
        className="border border-black"
        name="flightType"
        id="flightType"
        onChange={handleFlightTypeChange}
      >
        <option value="one-way">one-way-flight</option>
        <option value="return">return flight</option>
      </select>
      <input
        type="text"
        aria-label="outboundDate date"
        placeholder="DD.MM.YYYY"
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
        placeholder="DD.MM.YYYY"
        className={` m-2 rounded border  border-black disabled:bg-slate-200  disabled:text-slate-400 ${
          isDateValid(!returnDate ? "" : parseDate(returnDate))
            ? ""
            : "bg-red-500"
        }`}
        value={flightType === "return" ? returnDate : outboundDate}
        disabled={isReturnInputDisable(flightType)}
        onChange={(e) => setReturnDate(e.target.value)}
      />
      <button
        type="submit"
        className="flex-auto m-2 w-20 bg-blue-300 text-gray-700 disabled:text-slate-400"
        disabled={isButtonDisabled(outboundDate, returnDate)}
        onClick={handleBook}
      >
        Book
      </button>
      <p>{message}</p>
    </div>
  );
}

function isReturnInputDisable(input: "one-way" | "return"): boolean {
  switch (input) {
    case "return":
      return false;
    case "one-way":
      return true;
    default:
      assertNever(input);
  }
}

//when setReturnDate(outboundDate)isn't use in line 17, the function will be like this.
// function isButtonDisabled(
//   flightType: "one-way" | "return",
//   inputOne: string,
//   inputTwo: string
// ): boolean {
//   const inputOneDate = parseDate(inputOne);
//   const inputTwoDate = parseDate(inputTwo);
//   if (flightType === "one-way") {
//     return (
//       inputOne === "" ||
//       inputTwo === "" ||
//       inputOneDate === null ||
//       !isDateValid(inputOneDate)
//     );
//   } // ??complexer
//   return (
//     inputOne === "" ||
//     inputTwo === "" ||
//     !isDateValid(inputOneDate) ||
//     !isDateValid(inputTwoDate) ||
//     inputOneDate === null ||
//     inputTwoDate === null ||
//     inputOneDate.getTime() > inputTwoDate.getTime()
//   );
// }

function isButtonDisabled(outboundDate: string, returnDate: string): boolean {
  const parsedOutboundDate = parseDate(outboundDate);
  const parsedReturnDate = parseDate(returnDate);
  return (
    outboundDate === "" ||
    returnDate === "" ||
    !isDateValid(parsedOutboundDate) ||
    !isDateValid(parsedReturnDate) ||
    parsedOutboundDate === null ||
    parsedReturnDate === null ||
    parsedOutboundDate.getTime() > parsedReturnDate.getTime()
  );
}

function isDateValid(input: "" | Date | null): boolean {
  switch (input) {
    case "":
      return true;
      [];
    case null:
      return false;
    default:
      const currentDateNumber = new Date().getTime();
      const inputOneDateNumber = input.getTime();
      return inputOneDateNumber > currentDateNumber;
  }
}

export function parseDate(input: string): Date | null {
  const regex = /^\d{1,2}.\d{1,2}.\d{4}$/;
  if (!regex.test(input)) {
    return null;
  }
  const match = input.match(/^([\d]*)\.([\d]*)\.([\d]*)/);
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
