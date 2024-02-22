import { useState } from "react";
import { v4 as uuid } from "uuid";
import { TextInput } from "./TextInput";
import { assertNever } from "../utils/assertNever";

type User = {
  name: string;
  surname: string;
  id: string;
};
type UserInputs = Omit<User, "id">;
type UserList<User> = [User, ...User[]];

const initialUserList: UserList<User> = [
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

export function Crud() {
  const [userList, setUserList] = useState<UserList<User>>(initialUserList);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [userInputs, setUserInputs] = useState<UserInputs>({
    name: "",
    surname: "",
  });
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
    setUserList([...userList, newName]);
    setSelectedId(id);
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
    if (indexToDelete !== -1) userList.splice(indexToDelete, 1);
    resetState("selectedId");
    resetState("userInputs");
    resetState("filterValue");
    setMessage("The name is deleted");
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(e.target.value);
    const isSelectedIdInFilteredUserList = filterUserList(
      e.target.value,
      userList
    ).some((user) => user.id === selectedId);
    if (!isSelectedIdInFilteredUserList) {
      resetState("selectedId");
      resetState("userInputs");
    }
  }

  function handleUserInputsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const inputName = event.target.name;
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
    }
  }

  function resetState(stateName: "userInputs" | "filterValue" | "selectedId") {
    switch (stateName) {
      case "userInputs":
        setUserInputs({
          name: "",
          surname: "",
        });
        return;
      case "filterValue":
        setFilterValue("");
        return;
      case "selectedId":
        setSelectedId(undefined);
        return;
      default:
        assertNever(stateName);
    }
  }

  return (
    <div className="w-full m-auto p-5 bg-blue-100 md:w-4/5  md:bg-green-100 lg:w-4/5  lg:bg-red-100">
      <TextInput
        children="Filter prefix:"
        name="filter"
        value={filterValue}
        onChange={handleFilterChange}
      />
      <select
        className="w-4/5 h-40 border border-black m-auto md:w-80 overflow-y-scroll "
        size={10}
        onChange={(e) => {
          setSelectedId(e.target.value);
          setUserInputs(
            filteredUserList!.find((user) => user.id === e.target.value)!
          );
        }}
        value={selectedId}
      >
        {filteredUserList.map((user) => {
          return <UserOption key={user.id} user={user} />;
        })}
      </select>
      <div>
        <TextInput
          children="Name:"
          name="name"
          value={userInputs?.name ?? ""}
          onChange={handleUserInputsChange}
        />
        <TextInput
          children="Surname:"
          name="surname"
          value={userInputs?.surname ?? ""}
          onChange={handleUserInputsChange}
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

function UserOption({ user }: { user: User }) {
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
