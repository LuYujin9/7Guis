import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Input } from "./Input";

/* how to type it, there should be always at least a user name in name list. */
type User = {
  name: string;
  surname: string;
  id: string;
};
type UserInputs = Omit<User, "id">;

const initialNameList: User[] = [
  { name: "Jane", surname: "Davis", id: "0" },
  { name: "John", surname: "Wilson", id: "1" },
  { name: "Tisch", surname: "Roman", id: "2" },
  { name: "Isabella", surname: "White", id: "3" },
  { name: "Jane", surname: "Davis", id: "4" },
  { name: "John", surname: "Wilson", id: "5" },
  { name: "Tisch", surname: "Roman", id: "6" },
  { name: "Isabella", surname: "White", id: "7" },
  { name: "Jane", surname: "Davis", id: "8" },
  { name: "John", surname: "Wilson", id: "9" },
  { name: "Tisch", surname: "Roman", id: "10" },
];

export function Crud() {
  const [userList, setNameList] = useState<User[]>(initialNameList);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [userInputs, setUserInputs] = useState<UserInputs>({
    name: "",
    surname: "",
  });
  const [message, setMessage] = useState<string>("");

  const filteredNameList = filterNameList(filterValue, userList);
  console.log(userInputs, selectedId);

  /* 如何用上hashMap */
  // const nameListHashMap = useMemo(
  //   () => generateNameListHashMap(userList),
  //   [userList]
  // );

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
    resetState("filterValue");
    setSelectedId(id);
    setMessage("The name is created");
  }

  function handleUpdate(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("Please choose a name");
      return;
    }
    if (!userInputs.name || !userInputs.surname) {
      setMessage("Please give a name");
      return;
    }
    if (selectedId && userInputs.name && userInputs.surname) {
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
    resetState("selectedId");
    resetState("userInputs");
    resetState("filterValue");
    setMessage("The name is deleted");
  }

  function handleChangeUserInputs(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const name = event.target.name;
    switch (name) {
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

  function assertNever(value: never): never {
    throw new Error(`value should not exist ${value}`);
  }

  return (
    <div className="w-full m-auto p-5 bg-blue-100 md:w-4/5  md:bg-green-100 lg:w-4/5  lg:bg-red-100">
      <Input
        children="Filter prefix:"
        name="filter"
        value={filterValue}
        onChange={(e) => {
          setFilterValue(e.target.value);
          resetState("selectedId");
        }}
      />
      <select
        className="w-4/5 h-40 border border-black m-auto md:w-80 overflow-y-scroll "
        size={10}
        onChange={(e) => {
          setSelectedId(e.target.value);
          setUserInputs(searchUserById(e.target.value, filteredNameList));
        }}
        value={selectedId}
      >
        {filteredNameList.map((user) => {
          return <NameBox key={user.id} user={user} />;
        })}
      </select>

      <div>
        <Input
          children="Name:"
          name="name"
          value={userInputs?.name ?? ""}
          // value={
          //   userInputs?.name ?? searchUserById(selectedId)?.name ?? "no selectedID"
          // }
          onChange={handleChangeUserInputs}
        />
        <Input
          children="Surname:"
          name="surname"
          value={userInputs?.surname ?? ""}
          // value={
          //   userInputs?.surname ?? searchUserById(selectedId)?.name ?? "no selectedID"
          // }
          onChange={handleChangeUserInputs}
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

function filterNameList(input: string, list: User[]) {
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
function searchUserById(id: string, nameList: User[]): UserInputs {
  const matchedName = nameList!.find((name) => name.id === id)!;
  return matchedName;
}
// function generateNameListHashMap(userList: User[]) {
//   const nameListHashMap = new Map();
//   userList.forEach((user) => {
//     nameListHashMap.set(user.id, user);
//   });
//   return nameListHashMap;
// }
