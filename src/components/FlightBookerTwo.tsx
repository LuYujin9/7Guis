import { useState } from "react";
import { assertNever } from "../utils/assertNever";

export function FlightBookerTwo() {
  const [combobox, setCombobox] = useState<"one-way" | "return">("one-way");
  const [outboundDate, setOutboundDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function changeFlightType(event: React.ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "return":
        setCombobox("return");
        return;
      case "one-way":
        setCombobox("one-way");
        return;
      default:
        throw new Error(`value should not exist ${event.target.value}`);
    }
  }

  function updateOutbound(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setOutboundDate("");
      return;
    }
    setOutboundDate(event.target.value);
    if (isReturnInputDisable(combobox)) {
      setReturnDate(event.target.value);
    }
  }

  function handleBook() {
    const message = `You have booked a ${combobox} flight on ${outboundDate} ${
      combobox === "return" ? `and ${returnDate}` : ""
    } `;
    setMessage(message);
  }

  return (
    <div>
      <select
        className="border border-black"
        name="flight"
        id="flight"
        onChange={changeFlightType}
      >
        <option value="one-way">one-way-flight</option>
        <option value="return">return flight</option>
      </select>
      <input
        type="text"
        aria-label="outbound date"
        placeholder="DD.MM.YYYY"
        className={` m-2 rounded border  border-black ${
          isValidDate(!outboundDate ? "" : parseDate(outboundDate))
            ? ""
            : "bg-red-500"
        }`}
        value={outboundDate}
        onChange={updateOutbound}
      />
      <input
        type="text"
        aria-label="return date"
        placeholder="DD.MM.YYYY"
        className={` m-2 rounded border  border-black disabled:bg-slate-200  disabled:text-slate-400 ${
          isValidDate(!returnDate ? "" : parseDate(returnDate))
            ? ""
            : "bg-red-500"
        }`}
        value={combobox === "return" ? returnDate : outboundDate}
        disabled={isReturnInputDisable(combobox)}
        onChange={(e) => setReturnDate(e.target.value)}
      />
      <button
        type="submit"
        className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 disabled:text-slate-400"
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

function isButtonDisabled(inputOne: string, inputTwo: string): boolean {
  return (
    inputOne === "" ||
    inputTwo === "" ||
    !isValidDate(inputOne) ||
    !isValidDate(inputTwo) ||
    new Date(inputOne).getTime() > new Date(inputTwo).getTime()
  );
}

function isValidDate(input: string | null): boolean {
  switch (input) {
    case "":
      return true;
    case null:
      return false;
    default:
      const currentDateNumber = new Date().getTime();
      const inputDate = new Date(input).getTime();
      return inputDate > currentDateNumber;
  }
}

export function parseDate(input: string): string | null {
  const regex = /^(0?[1-9]|[12]\d|3[01]).(0?[1-9]|1[0-2]).\d{4}$/;
  if (!regex.test(input)) {
    return null;
  }
  const match = input.match(/^([\d]*)\.([\d]*)\.([\d]*)/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const formatDate = year + "-" + month + "-" + day;
    return formatDate;
  }
  return null;
}
