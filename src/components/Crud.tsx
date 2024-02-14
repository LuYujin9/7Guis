import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CurdInput } from "./CurdInput";

type FullName = {
  frontName: string;
  surname: string;
  id: string;
};

type InputsValues = {
  filter: string;
  name: string;
  surname: string;
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
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [message, setMessage] = useState<string>("");
  const [
    inputValues,
    setInputValuesById,
    setInputValuesByChange,
    setInputValuesFromDirectAssignment,
  ] = useInputValues();

  const filteredNameList = setfilteredNameList(inputValues.filter, nameList);

  const nameListHashMap = useMemo(
    () => generateNameListHashMap(nameList),
    [nameList]
  );

  function handleCreat() {
    if (inputValues.name === "" && inputValues.surname === "") {
      setMessage("Please give a name");
      return;
    }
    const id = uuidv4();
    const newName = {
      frontName: inputValues.name,
      surname: inputValues.surname,
      id: id,
    };
    setNameList([...nameList, newName]);
    setSelectedId(id);
    setInputValuesFromDirectAssignment(
      "",
      inputValues.name,
      inputValues.surname
    );
    setMessage("The name is created");
  }

  function handleUpdate(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("Please choose a name");
      return;
    }
    if (inputValues.name === "" && inputValues.surname === "") {
      setMessage("Please give a name");
      return;
    }
    if (selectedId && inputValues.name && inputValues.surname) {
      const updatedName = {
        frontName: inputValues.name,
        surname: inputValues.surname,
        id: selectedId,
      };
      const updatedNameList = nameList.map((name) => {
        return name.id === selectedId ? updatedName : name;
      });
      setNameList(updatedNameList);
      setInputValuesFromDirectAssignment(
        "",
        inputValues.name,
        inputValues.surname
      );
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
    setSelectedId(undefined);
    setInputValuesFromDirectAssignment("", "", "");
    setMessage("The name is deleted");
  }

  function handleSelectName(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    setSelectedId(selectedId);
    setInputValuesById(selectedId, nameListHashMap);
  }

  //there is still a bug
  function handleChangeFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const name = event.target.name;
    setInputValuesByChange(name, value);
    setInputValuesFromDirectAssignment(value, "", "");
    setSelectedId(undefined);
    /*find a better way? */
    // const newNameList = setfilteredNameList(value, nameList);
    // const isSelectedNameInFilteredNameList = newNameList.find(
    //   (fullName) => fullName.id === selectedId
    // );
    // if (!isSelectedNameInFilteredNameList) {
    //   setInputValuesFromDirectAssignment(value, "", "");
    //   setSelectedId(undefined);
    // }
  }

  function handleChangeNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const name = event.target.name;
    setInputValuesByChange(name, value);
  }

  function handleChangeSurnameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;
    const name = event.target.name;
    setInputValuesByChange(name, value);
  }

  return (
    <div className="w-full m-auto p-5 bg-blue-100 md:w-4/5  md:bg-green-100 lg:w-4/5  lg:bg-red-100">
      <CurdInput
        children="Filter prefix:"
        name="filter"
        value={inputValues.filter}
        onChange={(event) => {
          handleChangeFilter(event);
        }}
      />
      <select
        className="w-4/5 h-40 border border-black m-auto md:w-80 overflow-y-scroll "
        size={10}
        onChange={handleSelectName}
        value={selectedId ?? undefined}
      >
        {filteredNameList.map((fullName) => {
          return <NameBox key={fullName.id} fullName={fullName} />;
        })}
      </select>

      <div>
        <CurdInput
          children="Name:"
          name="name"
          value={inputValues.name}
          onChange={handleChangeNameInput}
        />
        <CurdInput
          children="Surname:"
          name="surname"
          value={inputValues.surname}
          onChange={handleChangeSurnameInput}
        />
      </div>

      <div>
        <Button label="Creat" onClick={() => handleCreat()} />
        <Button label="Update" onClick={() => handleUpdate(selectedId)} />
        <Button label="Delete" onClick={() => handleDelete(selectedId)} />
      </div>

      <p>{message}</p>
    </div>
  );
}

function setfilteredNameList(input: string, list: FullName[]) {
  const filterValue = input.toLowerCase();
  return list.filter((name) =>
    name.surname.toLowerCase().startsWith(filterValue)
  );
}

function generateNameListHashMap(nameList: FullName[]) {
  const nameListHashMap = new Map();
  nameList.forEach((fullname) => {
    nameListHashMap.set(fullname.id, fullname);
  });
  return nameListHashMap;
}

function useInputValues() {
  const [inputValues, setInputValues] = useState<InputsValues>({
    filter: "",
    name: "",
    surname: "",
  });

  function setInputValuesById(
    id: string | undefined,
    nameListHashMap: Map<any, any>
  ) {
    const matchedName = nameListHashMap.get(id);
    if (id === undefined || !matchedName) {
      setInputValues({
        filter: inputValues.filter,
        name: "",
        surname: "",
      });
      return;
    }
    setInputValues({
      filter: inputValues.filter,
      name: matchedName.frontName,
      surname: matchedName.surname,
    });
  }

  function setInputValuesByChange(name: string, value: string) {
    switch (name) {
      case "filter":
        setInputValues({
          filter: value,
          name: inputValues.name,
          surname: inputValues.surname,
        });
        return;
      case "name":
        setInputValues({
          filter: inputValues.filter,
          name: value,
          surname: inputValues.surname,
        });
        return;
      case "surname":
        setInputValues({
          filter: inputValues.filter,
          name: inputValues.name,
          surname: value,
        });
        return;
      default:
        assertNever(name);
    }
  }
  function setInputValuesFromDirectAssignment(
    filterValue: string,
    nameValue: string,
    surnameValue: string
  ) {
    setInputValues({
      filter: filterValue,
      name: nameValue,
      surname: surnameValue,
    });
  }
  return [
    inputValues,
    setInputValuesById,
    setInputValuesByChange,
    setInputValuesFromDirectAssignment,
  ] as const;
}

function assertNever(value: never | string): never {
  throw new Error(`value should not exist ${value}`);
}

function NameBox({ fullName }: { fullName: FullName }) {
  return (
    <option className="text-left pl-2" value={fullName.id}>
      {fullName.frontName}, {fullName.surname}
    </option>
  );
}

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
