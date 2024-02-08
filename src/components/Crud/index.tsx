import { useState } from "react";
import NameBox from "./NameBox";
import "./index.css";

type nameList = {
  name: string;
  surname: string;
  id: string;
}[];

const initialNameList: nameList = [
  { name: "Emil", surname: "Hans", id: "0" },
  { name: "Mustername", surname: "Ma", id: "1" },
  { name: "Tisch", surname: "Roman", id: "2" },
  { name: "Tisch", surname: "Max", id: "3" },
]; //让id强行等于index,但是不好.
export default function Crud() {
  const [nameList, setNameList] = useState<nameList>(initialNameList);
  const [filterValue, setfilterValue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [error, setError] = useState<string>("");

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setfilterValue("");
      setCurrentId(undefined);
      return;
    }
    const formatFilterValue = formatAsName(event.target.value);
    setfilterValue(formatFilterValue);
    const id = searchMatchedId(formatFilterValue, nameList);
    setCurrentId(id);
  }

  function handleCreat() {
    if (isNameInvalid(name) || isNameInvalid(surname)) {
      setError("Please give the richt form of name");
      return;
    }
    const newName = {
      name: formatAsName(name),
      surname: formatAsName(surname),
      id: generateUniqueId(nameList),
    };
    setNameList([...nameList, newName]);
  }

  function handleUpdate(currentId: string | undefined) {
    if (!currentId) {
      setError("No name selected");
      return;
    }
    if (isNameInvalid(name) || isNameInvalid(surname)) {
      setError("Please give the richt form of name");
      return;
    }
    if (currentId && name && surname) {
      const updatedName = {
        name: formatAsName(name),
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
    setName(event.target.value);
  }

  function handleChangeSurnameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSurname(event.target.value);
  }

  return (
    <>
      <div>
        <label>
          Filter prefix:
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterChange}
          />
        </label>
      </div>
      <div className="name-list">
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
          <input type="text" value={name} onChange={handleChangeNameInput} />
        </label>
        <label>
          Surname:
          <input
            type="text"
            value={surname}
            onChange={handleChangeSurnameInput}
          />
        </label>
      </div>
      <div>
        <button onClick={() => handleCreat()}>Creat</button>
        <button onClick={() => handleUpdate(currentId)}>Update</button>
        <button onClick={() => handleDelete(currentId)}>Delete</button>
      </div>
      <p>{error}</p>
    </>
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

//useId 的解决方法?
function generateUniqueId(inputArray: nameList) {
  const id = inputArray.length.toString();
  return id;
}

function searchMatchedId(input: string, list: nameList): string | undefined {
  const name = list.find((name) => name.surname.startsWith(input));
  if (name) {
    return name.id;
  }
  return undefined;
}
