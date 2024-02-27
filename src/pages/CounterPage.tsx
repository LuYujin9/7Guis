import { useState } from "react";
import { NavLink } from "react-router-dom";

export function CounterPage() {
  const [count, setCount] = useState(0);

  function handelCount() {
    setCount(count + 1);
  }

  return (
    <>
      <div>
        <input
          className="flex-auto m-2 w-20 rounded border border-black"
          type="text"
          id="count"
          name="count"
          value={count}
          readOnly
        />
        <button
          className="py-2 px-4 m-3 rounded bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
          type="submit"
          onClick={handelCount}
        >
          Count
        </button>
      </div>
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
