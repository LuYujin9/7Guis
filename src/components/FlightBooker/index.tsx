import { useState } from "react";
import "./index.css";

export default function FlightBooker() {
  //type of combobox? string, boolean or context?
  const [combobox, setCombobox] = useState<"one-way" | "return">("one-way");
  const [outboundDate, setOutboundDate] = useState<string | undefined>();
  const [returnDate, setReturnDate] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");

  //a better name?
  function changeFlightType(event: React.ChangeEvent<HTMLSelectElement>) {
    if (event.target.value === "return") {
      setCombobox("return");
      return;
    }
    if (event.target.value === "one-way") {
      setCombobox("one-way");
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
        type="text"
        aria-label="outbound date"
        placeholder="MM.DD.YYYY"
        className={isValidDate(outboundDate) ? "" : "invalid"}
        value={outboundDate ? outboundDate : ""}
        onChange={updateOutbound}
      />
      <input
        type="text"
        aria-label="return date"
        placeholder="MM.DD.YYYY"
        className={`${isValidDate(returnDate) ? "" : "invalid"} ${
          isReturnInputDisable(combobox) ? "disabled" : ""
        }`}
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

function isReturnInputDisable(input: "one-way" | "return") {
  if (input === "return") {
    return false;
  }
  if (input === "one-way") {
    return true;
  }
}

function isButtonDisabled(
  inputOne: string | undefined,
  inputTwo: string | undefined
) {
  if (inputOne === undefined && inputTwo === undefined) {
    return true;
  }
  if (
    formatDate(inputOne) <= formatDate(inputTwo) &&
    isValidDate(inputOne) &&
    isValidDate(inputTwo)
  ) {
    return false;
  }
  return true;
}

//***try to update, that "1.2.2023" is also invalid
function isValidDate(input: string | undefined) {
  if (input === undefined) {
    return true;
  }
  if (/^\d{2}.\d{2}.\d{4}$/.test(input)) {
    const dateNumber = formatDate(input); //?NaN
    const currentDateNumber = new Date().getTime();
    return currentDateNumber <= dateNumber; // is it good? or I should check the situation, that dateNummber ist NaN.
    //return !isNaN(dateNumber); when it's not a date, not a number  , not not a number return true
  }
  return false;
}

//a better name?
function formatDate(input: string | undefined) {
  if (input === undefined) {
    return NaN;
  }
  const dateString =
    input.slice(3, 5) + "-" + input.slice(0, 2) + "-" + input.slice(6);
  return new Date(dateString).getTime();
}
