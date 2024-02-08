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
  { name: "Mustername", surname: "Max", id: "1" },
  { name: "Tisch", surname: "Roman", id: "2" },
]; //让id强行等于index,但是不好.
export default function Crud() {
  const [nameList, setNameList] = useState<nameList>(initialNameList);
  const [filterInputValue, setFilterInputValue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [currentId, setCurrentId] = useState<string | undefined>("");
  const [error, setError] = useState<string>("");

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterInputValue(event.target.name);
    // const surnameList = nameList.map((name) => {
    //   return name.surname;
    // });
    // console.log(surnameList);
  }
  function handleChangeNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleChangeSurnameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSurname(event.target.value);
  }

  function handleUpdate(currentId: string | undefined) {
    if (!currentId) {
      setError("No name selected");
      return;
    }
    if (!name || !surname) {
      setError("Please give the richt form of name");
      return;
    }
    if (currentId && name && surname) {
      const updatedName = {
        name: name,
        surname: surname,
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

  return (
    <>
      <div>
        <label>
          Filter prefix:
          <input type="text" onChange={handleFilterChange} />
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
        <button>Creat</button>
        <button onClick={() => handleUpdate(currentId)}>Update</button>
        <button onClick={() => handleDelete(currentId)}>Delete</button>
      </div>
      <p>{error}</p>
    </>
  );
}
