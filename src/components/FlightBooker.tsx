import { useState } from "react";

export function FlightBooker() {
  const [combobox, setCombobox] = useState<"one-way" | "return">("one-way");
  const [outboundDate, setOutboundDate] = useState<string | undefined>();
  const [returnDate, setReturnDate] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");

  function changeFlightType(event: React.ChangeEvent<HTMLSelectElement>) {
    switch (event.target.value) {
      case "return":
        setCombobox("return");
        return;
      case "one-way":
        setCombobox("one-way");
        setReturnDate(outboundDate);
        return;
      default:
        assertNever(event.target.value);
    }
  }

  function updateOutbound(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(typeof event.target.value, event.target.value);
    if (!event.target.value) {
      setOutboundDate("");
      return;
    }
    setOutboundDate(event.target.value);
    if (isReturnInputDisable(combobox)) {
      setReturnDate(event.target.value);
    }
  }

  function updateReturn(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setReturnDate(undefined);
      return;
    }
    setReturnDate(event.target.value);
  }

  function handleBook() {
    const message = `You have booked a ${combobox} flight on ${outboundDate} ${
      combobox === "return" ? `and ${returnDate}` : ""
    } `;
    setMessage(message);
  }

  return (
    <div>
      <select name="flight" id="flight" onChange={changeFlightType}>
        <option value="one-way">one-way-flight</option>
        <option value="return">return flight</option>
      </select>
      <input
        type="date"
        aria-label="outbound date"
        placeholder="DD.MM.YYYY"
        className={isValidDate(outboundDate) ? "" : "invalid"}
        value={outboundDate ? outboundDate : ""}
        onChange={updateOutbound}
      />
      <input
        type="date"
        aria-label="return date"
        placeholder="DD.MM.YYYY"
        className={`${isValidDate(returnDate) ? "" : "invalid"} `}
        value={returnDate ? returnDate : ""}
        disabled={isReturnInputDisable(combobox)}
        onChange={updateReturn}
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

function assertNever(value: never | string): never {
  throw new Error(`value should not exist ${value}`);
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
    !isValidDate(inputOne) ||
    !isValidDate(inputTwo) ||
    new Date(inputOne).getTime() > new Date(inputTwo).getTime()
  );
}

function isValidDate(input: string | undefined): boolean {
  if (input === undefined) {
    return true;
  }
  const currentDateNumber = new Date().getTime();
  const inputDate = new Date(input).getTime();
  //  console.log(inputDate > currentDateNumber);
  return inputDate > currentDateNumber;
}

//   if (input === undefined) {
//     return true;
//   }
// if (/^\d{1,2}.\d{1,2}.\d{4}$/.test(input)) {
//   const dateNumber = formatDate(input);
// if (dateNumber === undefined) return false;
//   return currentDateNumber <= dateNumber;
// }
//   return false;

// //a better name?
// function formatDate(input: string | undefined): number {
//   if (input === undefined) {
//     return NaN;
//   }
//   const formatedInput = formatInput(input);
//   // const day = parseInt(formatedInput[0]);
//   // const time = new Date(year, month, day);
//   formatedInput.splice(2, 0, ".");
//   const dateString = formatedInput.join("");
//   //   input.slice(3, 5) + "-" + input.slice(0, 2) + "-" + input.slice(6);
//   const time = new Date(dateString).getTime();
//   // if (isNaN(time)) return undefined;
//   return time;
// }

// function formatInput(input: string): string[] {
//   const array = input.split("");
//   if (array.findIndex((e) => e === ".") !== 2) {
//     array.unshift("0");
//     array.splice(2, 1);
//   }
//   if (array.findIndex((e) => e === ".") !== 4) {
//     array.splice(2, 0, "0");
//   }
//   return array;
// }
