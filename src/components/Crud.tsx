import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type FullName = {
  frontName: string;
  surname: string;
  id: string;
};

const initialNameList: FullName[] = [
  { frontName: "Jane", surname: "Davis", id: "0" },
  { frontName: "John", surname: "Wilson", id: "1" },
  { frontName: "Tisch", surname: "Roman", id: "2" },
  { frontName: "Isabella", surname: "White", id: "3" },
  { frontName: "Jane", surname: "Davis", id: "4" },
  { frontName: "John", surname: "Wilson", id: "5" },
  { frontName: "Tisch", surname: "Roman", id: "6" },
  { frontName: "Isabella", surname: "White", id: "7" },
  { frontName: "Jane", surname: "Davis", id: "8" },
  { frontName: "John", surname: "Wilson", id: "9" },
  { frontName: "Tisch", surname: "Roman", id: "10" },
  { frontName: "Isabella", surname: "White", id: "11" },
];

export function Crud() {
  const [nameList, setNameList] = useState<FullName[]>(initialNameList);
  const [currentNameList, setCurrentNameList] =
    useState<FullName[]>(initialNameList);
  const [filterValue, setfilterValue] = useState<string>("");
  const [frontName, setFrontName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setInputValuesBySelectedId(selectedId, currentNameList);
    // console.log("updated by selectedId");
  }, [selectedId]);

  // console.log("re-rendered");

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setfilterValue("");
      setCurrentNameList(nameList);
      return;
    }
    const formatFilterValue = formatAsName(event.target.value);
    setfilterValue(formatFilterValue);
    const matchedNames = filterNamesBySurname(formatFilterValue, nameList);
    setCurrentNameList(matchedNames);
    setSelectedId(undefined);
  }

  function handleCreat() {
    if (isNameInvalid(frontName) || isNameInvalid(surname)) {
      setMessage("Please give the richt form of name");
      return;
    }
    const id = uuidv4();
    const newName = {
      frontName: frontName,
      surname: surname,
      id: id,
    };
    setNameList([...nameList, newName]);
    setCurrentNameList([...nameList, newName]);
    // is there a way to re-render only in one time? is it necessary
    setfilterValue("");
    setSelectedId(id);
    setMessage("The name is created");
  }

  function handleUpdate(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("No name is selected");
      return;
    }
    if (isNameInvalid(frontName) || isNameInvalid(surname)) {
      setMessage("Please give the richt form of name");
      return;
    }
    if (selectedId && frontName && surname) {
      const updatedName = {
        frontName: frontName,
        surname: surname,
        id: selectedId,
      };
      const updatedNameList = nameList.map((name) => {
        return name.id === selectedId ? updatedName : name;
      });
      setNameList(updatedNameList);
      setCurrentNameList(updatedNameList);
      setfilterValue("");
      setMessage("The name is updated");
    }
  }

  function handleDelete(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("No name selected");
      return;
    }
    const updatedNameList = nameList.filter((name) => name.id !== selectedId);
    setNameList(updatedNameList);
    setCurrentNameList(updatedNameList);
    setSelectedId(undefined);
    setfilterValue("");
    setMessage("The name is deleted");
  }

  function handleChangeNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    setFrontName(formatAsName(event.target.value));
  }

  function handleChangeSurnameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSurname(formatAsName(event.target.value));
  }

  function handleSelectName(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedId(event.target.value);
  }

  //name?
  function setInputValuesBySelectedId(
    selectedId: string | undefined,
    nameList: FullName[]
  ) {
    const selectedName = findNameById(nameList, selectedId);
    if (!selectedName) {
      setFrontName("");
      setSurname("");
      return;
    }
    setFrontName(selectedName.frontName);
    setSurname(selectedName.surname);
  }

  return (
    <div className="w-full m-auto p-5 bg-blue-100 md:w-4/5  md:bg-green-100 lg:w-4/5  lg:bg-red-100">
      <label>
        Filter prefix:
        <input
          className="m-2 w-20 rounded border border-black"
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
        />
      </label>
      <select
        className="w-4/5 h-40 border border-black m-auto md:w-80 overflow-y-scroll "
        size={10}
        onChange={handleSelectName}
        value={selectedId ?? undefined}
        //didn't re-rendered, when selectedId changed to undefined
      >
        {currentNameList.map((fullName) => {
          return <NameBox key={fullName.id} fullName={fullName} />;
        })}
      </select>
      <div>
        <label>
          Name:
          <input
            className="m-2 w-20 rounded border border-black"
            type="text"
            value={frontName}
            onChange={handleChangeNameInput}
          />
        </label>
        <label>
          Surname:
          <input
            className="m-auto w-20 rounded border border-black"
            type="text"
            value={surname}
            onChange={handleChangeSurnameInput}
          />
        </label>
      </div>
      <div>
        <button
          className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
          onClick={() => handleCreat()}
        >
          Creat
        </button>
        <button
          className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
          onClick={() => handleUpdate(selectedId)}
        >
          Update
        </button>
        <button
          className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
          onClick={() => handleDelete(selectedId)}
        >
          Delete
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}

function formatAsName(input: string) {
  if (!input) {
    return "";
  }
  const firstLetter = input[0].toUpperCase();
  const otherLetters = input.slice(1).toLowerCase();
  return firstLetter + otherLetters;
}

function isNameInvalid(input: string) {
  const regex = /^[a-zA-Z]+$/g;
  return !regex.test(input);
}

function filterNamesBySurname(input: string, list: FullName[]): FullName[] {
  const names = list.filter((name) => name.surname.startsWith(input));
  return names;
}

function findNameById(nameList: FullName[], id: string | undefined) {
  return nameList.find((name) => name.id === id);
}

function NameBox({ fullName }: { fullName: FullName }) {
  return (
    <option className="text-left pl-2" value={fullName.id}>
      {fullName.frontName}, {fullName.surname}
    </option>
  );
}
