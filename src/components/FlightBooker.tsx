import { useState } from "react";
import { assertNever } from "../utils/assertNever";

export function FlightBooker() {
  const [flightType, setFlightType] = useState<"one-way" | "return">("one-way");
  const [outboundDate, setOutboundDate] = useState<string | undefined>();
  const [returnDate, setReturnDate] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "return":
        setFlightType("return");
        return;
      case "one-way":
        setFlightType("one-way");
        setReturnDate(outboundDate); //when it not updated, can"t book the right time. solution is in the component FlightBookerTwo
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
        name="flight"
        id="flight"
        onChange={handleFlightTypeChange}
      >
        <option value="one-way">one-way-flight</option>
        <option value="return">return flight</option>
      </select>
      <input
        type="date"
        aria-label="outbound date"
        placeholder="DD.MM.YYYY"
        className={` m-2  rounded border  border-black  ${
          isDateValid(outboundDate) ? "" : "bg-red-500"
        }`}
        value={outboundDate ? outboundDate : ""}
        onChange={updateOutbound}
      />
      <input
        type="date"
        aria-label="return date"
        placeholder="DD.MM.YYYY"
        className={` m-2  rounded border  border-black  disabled:bg-slate-200  disabled:text-slate-400 ${
          isDateValid(outboundDate) ? "" : "bg-red-500"
        }`}
        value={returnDate ? returnDate : ""}
        disabled={isReturnInputDisable(flightType)}
        onChange={(e) => {
          setReturnDate(e.target.value ?? "");
        }}
      />
      <button
        type="submit"
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

function isButtonDisabled(
  inputOne: string | undefined,
  inputTwo: string | undefined
): boolean {
  return (
    inputOne === undefined ||
    inputTwo === undefined ||
    !isDateValid(inputOne) ||
    !isDateValid(inputTwo) ||
    new Date(inputOne).getTime() > new Date(inputTwo).getTime()
  );
}

function isDateValid(input: string | undefined): boolean {
  if (input === undefined) {
    return true;
  }
  const currentDateNumber = new Date().getTime();
  const inputDate = new Date(input).getTime();
  return inputDate > currentDateNumber;
}
