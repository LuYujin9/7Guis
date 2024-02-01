import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Counter() {
  const [count, setCount] = useState(0);

  function handelCount() {
    setCount(count + 1);
  }

  return (
    <>
      <div>
        <input type="text" id="count" name="count" value={count} readOnly />
        <button type="submit" onClick={handelCount}>
          Count
        </button>
      </div>
      <NavLink to="/">Back to homepage</NavLink>
    </>
  );
}
