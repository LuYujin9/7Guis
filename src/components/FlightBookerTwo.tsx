import { useState } from "react";
import { assertNever } from "../utils/assertNever";

export function FlightBookerTwo() {
  const [combobox, setCombobox] = useState<"one-way" | "return">("one-way");
  const [outboundFlight, setOutboundFlight] = useState<string>("");
  const [returnFlight, setReturnFlight] = useState<string>("");
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
      setOutboundFlight("");
      return;
    }
    setOutboundFlight(event.target.value);
    if (isReturnInputDisable(combobox)) {
      setReturnFlight(event.target.value);
    }
  }

  function handleBook() {
    const message = `You have booked a ${combobox} flight on ${outboundFlight} ${
      combobox === "return" ? `and ${returnFlight}` : ""
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
        aria-label="outboundFlight date"
        placeholder="DD.MM.YYYY"
        className={` m-2 rounded border  border-black ${
          isValidDate(!outboundFlight ? "" : parseDate(outboundFlight))
            ? ""
            : "bg-red-500"
        }`}
        value={outboundFlight}
        onChange={updateOutbound}
      />
      <input
        type="text"
        aria-label="return date"
        placeholder="DD.MM.YYYY"
        className={` m-2 rounded border  border-black disabled:bg-slate-200  disabled:text-slate-400 ${
          isValidDate(
            !returnFlight ? "" : parseDate(returnFlight),
            !outboundFlight ? "" : parseDate(outboundFlight)
          )
            ? ""
            : "bg-red-500"
        }`}
        value={combobox === "return" ? returnFlight : outboundFlight}
        disabled={isReturnInputDisable(combobox)}
        onChange={(e) => setReturnFlight(e.target.value)}
      />
      <button
        type="submit"
        className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 disabled:text-slate-400"
        disabled={isButtonDisabled(combobox, outboundFlight, returnFlight)}
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
  combobox: "one-way" | "return",
  inputOne: string,
  inputTwo: string
): boolean {
  const inputOneDate = parseDate(inputOne);
  const inputTwoDate = parseDate(inputTwo);
  if (combobox === "one-way") {
    return (
      inputOne === "" ||
      inputTwo === "" ||
      inputOneDate === null ||
      inputTwoDate === null ||
      !isValidDate(inputOneDate)
    );
  } // ?? simple or complex
  return (
    inputOne === "" ||
    inputTwo === "" ||
    !isValidDate(inputOneDate) ||
    !isValidDate(inputTwoDate) ||
    inputOneDate === null ||
    inputTwoDate === null ||
    inputOneDate.getTime() > inputOneDate.getTime()
  );
}

function isValidDate(
  inputOne: "" | Date | null,
  inputForComparison?: "" | Date | null
): boolean {
  switch (inputOne) {
    case "":
      return true;
    case null:
      return false;
    default:
      const currentDateNumber = new Date().getTime();
      const inputOneDateNumber = inputOne.getTime();
      if (inputForComparison) {
        const inputTwoDateNumber = inputForComparison.getTime();
        return (
          inputOneDateNumber > currentDateNumber &&
          inputOneDateNumber >= inputTwoDateNumber
        );
      }
      return inputOneDateNumber > currentDateNumber;
  }
}

export function parseDate(input: string): Date | null {
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
    return new Date(formatDate);
  }
  return null;
}
