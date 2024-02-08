import { useState } from "react";
import NameBox from "./NameBox";
import { v4 as uuidv4 } from "uuid";

type fullName = {
  frontName: string;
  surname: string;
  id: string;
};

const initialNameList: fullName[] = [
  { frontName: "Jane", surname: "Davis", id: "0" },
  { frontName: "John", surname: "Wilson", id: "1" },
  { frontName: "Tisch", surname: "Roman", id: "2" },
  { frontName: "Isabella", surname: "White", id: "3" },
]; //让id强行等于index,但是不好.
export default function Crud() {
  const [nameList, setNameList] = useState<fullName[]>(initialNameList);
  const [filterValue, setfilterValue] = useState<string>("");
  const [frontName, setFrontName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [error, setError] = useState<string>("");

  const inputStyle = "w-20 border border-black m-2 rounded";
  const buttonStyle =
    "bg-blue-300 hover:bg-emphasis hover:text-white text-gray-700 font-bold py-2 px-4 rounded";

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setfilterValue("");
      setCurrentId(undefined);
      return;
    }
    const formatFilterValue = formatAsName(event.target.value);
    setfilterValue(formatFilterValue);
    const fullName = searchMatchedName(formatFilterValue, nameList);
    setCurrentId(fullName ? fullName.id : "");
    setFrontName(fullName ? fullName.frontName : "");
    setSurname(fullName ? fullName.surname : "");
  }

  function handleCreat() {
    if (isNameInvalid(frontName) || isNameInvalid(surname)) {
      setError("Please give the richt form of name");
      return;
    }
    const newName = {
      frontName: formatAsName(frontName),
      surname: formatAsName(surname),
      id: uuidv4(),
    };
    setNameList([...nameList, newName]);
    setFrontName("");
    setSurname("");
  }

  function handleUpdate(currentId: string | undefined) {
    if (!currentId) {
      setError("No name selected");
      return;
    }
    if (isNameInvalid(frontName) || isNameInvalid(surname)) {
      setError("Please give the richt form of name");
      return;
    }
    if (currentId && frontName && surname) {
      const updatedName = {
        frontName: formatAsName(frontName),
        surname: formatAsName(surname),
        id: currentId,
      };
      const updatedNameList = nameList.map((name) => {
        if (name.id === currentId) {
          return updatedName;
        }
        return name;
      });
      setNameList(updatedNameList);
      setfilterValue("");
      setError("");
    }
  }

  function handleDelete(currentId: string | undefined) {
    if (!currentId) {
      setError("No name selected");
      return;
    }
    const updatedNameList = nameList.filter((name) => name.id !== currentId);
    setNameList(updatedNameList);
  }

  function handleChangeNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    setFrontName(event.target.value);
  }

  function handleChangeSurnameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSurname(event.target.value);
  }

  return (
    <div>
      <label>
        Filter prefix:
        <input
          className={inputStyle}
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
        />
      </label>
      <div className="w-80 h-40 border border-black overflow-y-scroll">
        {nameList.map((fullName) => {
          return (
            <NameBox
              key={fullName.id}
              fullName={fullName}
              currentId={currentId}
            />
          );
        })}
      </div>
      <div>
        <label>
          Name:
          <input
            className={inputStyle}
            type="text"
            value={frontName}
            onChange={handleChangeNameInput}
          />
        </label>
        <label>
          Surname:
          <input
            className={inputStyle}
            type="text"
            value={surname}
            onChange={handleChangeSurnameInput}
          />
        </label>
      </div>
      <div>
        <button className={buttonStyle} onClick={() => handleCreat()}>
          Creat
        </button>
        <button className={buttonStyle} onClick={() => handleUpdate(currentId)}>
          Update
        </button>
        <button className={buttonStyle} onClick={() => handleDelete(currentId)}>
          Delete
        </button>
      </div>
      <p>{error}</p>
    </div>
  );
}

function formatAsName(input: string) {
  const firstLetter = input[0].toUpperCase();
  const otherLetters = input.slice(1).toLowerCase();
  return firstLetter + otherLetters;
}

function isNameInvalid(input: string) {
  const regex = /[a-z]/g;
  return !regex.test(input);
}

function searchMatchedName(
  input: string,
  list: fullName[]
): fullName | undefined {
  const name = list.find((name) => name.surname.startsWith(input));
  return name ? name : undefined;
}
