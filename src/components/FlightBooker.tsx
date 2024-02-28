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
    const outboundDateString = dateToString(parseDate(dateState.outboundDate));
    if (dateState.flightType === "one-way-flight") {
      setMessage(`You have booked an one way flight on ${outboundDateString}`);
      return;
    }
    if (dateState.flightType === "return-flights") {
      const returnDateString = dateToString(parseDate(dateState.returnDate));
      setMessage(
        `You have booked an outbound flight on ${outboundDateString} and a return flight on ${returnDateString}`
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
                !isDateValid(parseDate(dateState.outboundDate)) &&
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
              !isDateValid(
                !dateState.outboundDate ? "" : parseDate(dateState.outboundDate)
              )
                ? "visible"
                : "invisible"
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
                dateState.flightType === "return-flights" &&
                dateState.returnDate &&
                !isDateValid(parseDate(dateState.returnDate)) &&
                "bg-red-500"
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
          {/* <div
            className={`text-red-600 text-xs ${
              dateState.flightType === "return-flights" &&
              isDateValid(parseDate(dateState.returnDate)) &&
              !isReturnDateAfterOutboundDate(
                dateState.outboundDate,
                dateState.returnDate
              ) &&
              "invisible"
            }`}
          >
            The date is invalid. The format is DD/MM/YY and the Date should not
            be earlier than outbound flight.
          </div> */}
        </div>
        <button
          type="submit"
          className="flex-auto h-12 border-2 rounded-[5px] bg-[#F5F5F5]  border-black shadow-[5px_5px_4px_0px]
        shadow-gray-400 text-gray-700 disabled:text-slate-400 hover:bg-[#DDE5DE] focus:bg-[#C7DAC9]"
          aria-label="book the flight"
          disabled={isButtonDisabled(dateState)}
          onClick={handleBook}
        >
          Book
        </button>
      </div>
      <div aria-label="message">{message}</div>
    </div>
  );
}

export function isButtonDisabled(state: DateState): boolean {
  const parsedOutboundDate = parseDate(state.outboundDate);
  if (state.flightType === "one-way-flight") {
    return !isDateValid(parsedOutboundDate);
  }
  const parsedReturnDate = parseDate(state.returnDate);
  return (
    !isDateValid(parsedOutboundDate) ||
    !isDateValid(parsedReturnDate) ||
    parsedOutboundDate === null ||
    parsedReturnDate === null ||
    parsedOutboundDate.getTime() > parsedReturnDate.getTime()
  );
}

// function isReturnDateAfterOutboundDate(
//   outboundDate: string,
//   returnDate: string
// ) {
//   if (!returnDate) {
//     return true;
//   }
//   const parsedOutboundDate = parseDate(outboundDate);
//   const parsedReturnDate = parseDate(returnDate);

//   if (parsedOutboundDate && parsedReturnDate) {
//     return parsedOutboundDate.getTime() < parsedReturnDate.getTime();
//   }
//   return false;
// }

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
