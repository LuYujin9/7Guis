import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Input } from "./Input";
import { assertNever } from "../utils/assertNever";

/* how to type it, there should be always at least a user name in name list. */
type User = {
  name: string;
  surname: string;
  id: string;
};
type UserInputs = Omit<User, "id">;
type UserList<User> = [User, ...User[]];

const initialNameList: UserList<User> = [
  { name: "Jane", surname: "Davis", id: "0" },
  { name: "John", surname: "Wilson", id: "1" },
  { name: "Jack", surname: "Roman", id: "2" },
  { name: "Isabella", surname: "White", id: "3" },
  { name: "Jane", surname: "Davis", id: "4" },
  { name: "John", surname: "Wilson", id: "5" },
  { name: "Jack", surname: "Roman", id: "6" },
  { name: "Isabella", surname: "White", id: "7" },
  { name: "Jane", surname: "Davis", id: "8" },
  { name: "John", surname: "Wilson", id: "9" },
  { name: "Jack", surname: "Roman", id: "10" },
];

export function CrudTwo() {
  const [userList, setNameList] = useState<UserList<User>>(initialNameList);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedId, userInputs, setIdAndInputsById, setUserInputs] =
    useIdAndInputsState();
  const [message, setMessage] = useState<string>("");

  const filteredUserList = filterUserList(filterValue, userList);

  function handleCreate() {
    if (!userInputs.name || !userInputs.surname) {
      setMessage("Please give a name");
      return;
    }
    const id = uuid();
    const newName = {
      name: userInputs.name,
      surname: userInputs.surname,
      id: id,
    };
    setNameList([...userList, newName]);
    setIdAndInputsById(id, [...userList, newName]);
    resetState("filterValue");
    setMessage("The name is created");
  }

  function handleUpdate(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("Please choose a name");
      return;
    }
    if (!userInputs.name && !userInputs.surname) {
      setMessage("Please give a name");
      return;
    }
    if (selectedId && (userInputs.name || userInputs.surname)) {
      //mutable with Reference Values. Object and array
      const oldUserToUpdate = userList.find((user) => user.id === selectedId)!;
      oldUserToUpdate.name = userInputs.name;
      oldUserToUpdate.surname = userInputs.surname;
      resetState("filterValue");
      setMessage("The name is updated");
    }
  }

  function handleDelete(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("Please select a name");
      return;
    }
    const indexToDelete = userList.findIndex((user) => user.id === selectedId);
    if (indexToDelete !== -1)
      // should I keep this 'if', even I know that, there must be a indexToDelete.
      userList.splice(indexToDelete, 1);
    resetState("selectedIdAndUserInputs");
    resetState("filterValue");
    setMessage("The name is deleted");
  }

  function handleChangeFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(e.target.value); //necessary to check, wether selected id in filteredUserList ? a better way?
    const isSelectedIdInFilteredUserList = filterUserList(
      e.target.value,
      userList
    ).some((user) => user.id === selectedId);
    if (!isSelectedIdInFilteredUserList) {
      console.log("reset");
      resetState("selectedIdAndUserInputs");
    }
  }

  function resetState(stateName: "filterValue" | "selectedIdAndUserInputs") {
    switch (stateName) {
      case "filterValue":
        setFilterValue("");
        return;
      case "selectedIdAndUserInputs":
        setIdAndInputsById(undefined, userList);
        return;
      default:
        assertNever(stateName);
    }
  }

  return (
    <div className="w-full m-auto p-5 bg-blue-100 md:w-4/5  md:bg-green-100 lg:w-4/5  lg:bg-red-100">
      <Input
        children="Filter prefix:"
        name="filter"
        value={filterValue}
        onChange={handleChangeFilter}
      />
      <select
        className="w-4/5 h-40 border border-black m-auto md:w-80 overflow-y-scroll "
        size={10}
        onChange={(e) => {
          setIdAndInputsById(e.target.value, filteredUserList);
        }}
        value={selectedId}
      >
        {filteredUserList.map((user) => {
          return <NameBox key={user.id} user={user} />;
        })}
      </select>
      <div>
        <Input
          children="Name:"
          name="name"
          value={userInputs?.name ?? ""}
          onChange={(e) => {
            setUserInputs(e.target.name, e.target.value);
          }}
        />
        <Input
          children="Surname:"
          name="surname"
          value={userInputs?.surname ?? ""}
          onChange={(e) => {
            setUserInputs(e.target.name, e.target.value);
          }}
        />
      </div>
      <div>
        <Button label="Create" onClick={() => handleCreate()} />
        <Button label="Update" onClick={() => handleUpdate(selectedId)} />
        <Button label="Delete" onClick={() => handleDelete(selectedId)} />
      </div>
      <p>{message}</p>
    </div>
  );
}

export function filterUserList(input: string, list: User[]) {
  const filterValue = input.toLowerCase();
  return list.filter((name) =>
    name.surname.toLowerCase().startsWith(filterValue)
  );
}

function NameBox({ user }: { user: User }) {
  return (
    <option className="text-left pl-2" value={user.id}>
      {user.name}, {user.surname}
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

export function useIdAndInputsState() {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [userInputs, setUserInputs] = useState<UserInputs>({
    name: "",
    surname: "",
  });
  function handleIdAndInputsChange(
    id: string | undefined,
    userList: User[] | undefined
  ) {
    setSelectedId(id);
    if (id === undefined || userList === undefined) {
      setUserInputs({ name: "", surname: "" });
      return;
    }
    const matchedName = userList!.find((name) => name.id === id)!;
    setUserInputs({
      name: matchedName.name,
      surname: matchedName.surname,
    });
  }
  function handleInputsChange(inputName: string, value: string) {
    switch (inputName) {
      case "name":
        setUserInputs({
          name: value,
          surname: userInputs?.surname ?? "",
        });
        return;
      case "surname":
        setUserInputs({
          name: userInputs?.name ?? "",
          surname: value,
        });
        return;
      default:
        throw new Error(`${value} is an invalid value`);
    }
  }
  return [
    selectedId,
    userInputs,
    handleIdAndInputsChange,
    handleInputsChange,
  ] as const;
}
