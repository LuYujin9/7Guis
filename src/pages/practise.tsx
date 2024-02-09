import { useState } from "react";

export default function Practise() {
  const [inputValue, setInputValue] = useState<string | undefined>("");

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    const valueArray = value.split("");
    if (valueArray.findIndex((e) => e === ".") !== 2) {
      valueArray.unshift("0");
      valueArray.splice(2, 1);
      console.log(valueArray);
    }
    if (valueArray.findIndex((e) => e === ".") !== 4) {
      valueArray.splice(2, 0, "0");
      console.log(valueArray);
      valueArray.splice(4, 1);

      console.log(valueArray);
    }
  }

  return (
    <>
      <input
        type="text"
        value={inputValue ? undefined : inputValue}
        onChange={handleInput}
      />
      <button>button</button>
    </>
  );
}
