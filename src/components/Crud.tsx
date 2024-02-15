import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CurdInput } from "./CurdInput";

//when name input value updated, but surname still leer.  ???null or ""
type UserName = {
  name: string; //???null or ""
  surname: string; //???null or ""
  id: string;
};

//type it, there should be always at least a user name in name list.

const initialNameList: UserName[] = [
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
  const [nameList, setNameList] = useState<UserName[]>(initialNameList);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [userName, setUserName] = useState<UserName | null>();
  const [message, setMessage] = useState<string>("");

  const filteredNameList = filterNameList(filterValue, nameList);

  /* 如何用上hashMap */
  // const nameListHashMap = useMemo(
  //   () => generateNameListHashMap(nameList),
  //   [nameList]
  // );

  function handleCreate() {
    if (!userName) {
      setMessage("Please give a name");
      return;
    }
    const id = uuidv4();
    const newName = {
      name: userName.name,
      surname: userName.surname,
      id: id,
    };
    setNameList([...nameList, newName]);
    setFilterValue("");
    setSelectedId(id);
    setMessage("The name is created");
  }

  function handleUpdate(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("Please choose a name");
      return;
    }
    if (!userName) {
      setMessage("Please give a name");
      return;
    }
    if (selectedId && userName.name && userName.surname) {
      const updatedUserName = {
        name: userName.name,
        surname: userName.surname,
        id: selectedId,
      };
      const updatedNameList = nameList.map((name) => {
        return name.id === selectedId ? updatedUserName : name;
      });
      setNameList(updatedNameList);
      setFilterValue("");
      setMessage("The name is updated");
    }
  }

  function handleDelete(selectedId: string | undefined) {
    if (!selectedId) {
      setMessage("Please select a name");
      return;
    }
    const updatedNameList = nameList.filter((name) => name.id !== selectedId);
    setNameList(updatedNameList);
    setUserName({
      name: "",
      surname: "",
      id: "",
    });
    setSelectedId(undefined);
    setMessage("The name is deleted");
  }

  function handleChangeFilter(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(event.target.value);
    setSelectedId(undefined);
  }

  function handleSelectName(event: React.ChangeEvent<HTMLSelectElement>) {
    const id = event.target.value;
    setSelectedId(id);
    setUserNameById(id);
  }

  function handleChangeNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    if (!userName) {
      const id = uuidv4(); //temporary Id, is it necessary?
      const newUserName = {
        name: inputValue,
        surname: "",
        id: id,
      };
      setUserName(newUserName);
      return;
    }
    const newUserName = {
      name: inputValue,
      surname: userName.surname,
      id: userName.id,
    };
    setUserName(newUserName);
  }

  function handleChangeSurnameInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const inputValue = event.target.value;
    if (!userName) {
      const id = uuidv4(); //temporary Id, is it necessary?
      const newUserName = {
        name: "",
        surname: inputValue,
        id: id,
      };
      setUserName(newUserName);
      return;
    }
    const newUserName = {
      name: userName.name,
      surname: inputValue,
      id: userName.id,
    };
    setUserName(newUserName);
  }

  function setUserNameById(id: string) {
    const matchedName = filteredNameList!.find((name) => name.id === id);
    if (!matchedName) {
      setUserName(null);
      return;
    }
    const newUserName = {
      name: matchedName.name,
      surname: matchedName.surname,
      id: matchedName.id,
    };
    setUserName(newUserName);
  }

  return (
    <div className="w-full m-auto p-5 bg-blue-100 md:w-4/5  md:bg-green-100 lg:w-4/5  lg:bg-red-100">
      <CurdInput
        children="Filter prefix:"
        name="filter"
        value={filterValue}
        onChange={(event) => {
          handleChangeFilter(event);
        }}
      />
      <select
        className="w-4/5 h-40 border border-black m-auto md:w-80 overflow-y-scroll "
        size={10}
        onChange={handleSelectName}
        value={selectedId}
      >
        {filteredNameList.map((userName) => {
          return <NameBox key={userName.id} userName={userName} />;
        })}
      </select>

      <div>
        <CurdInput
          children="Name:"
          name="name"
          value={userName?.name ?? ""}
          onChange={handleChangeNameInput}
        />
        <CurdInput
          children="Surname:"
          name="surname"
          value={userName?.surname ?? ""}
          onChange={handleChangeSurnameInput}
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

function filterNameList(input: string, list: UserName[]) {
  const filterValue = input.toLowerCase();
  return list.filter((name) =>
    name.surname.toLowerCase().startsWith(filterValue)
  );
}

function NameBox({ userName }: { userName: UserName }) {
  return (
    <option className="text-left pl-2" value={userName.id}>
      {userName.name}, {userName.surname}
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

// function generateNameListHashMap(nameList: UserName[]) {
//   const nameListHashMap = new Map();
//   nameList.forEach((userName) => {
//     nameListHashMap.set(userName.id, userName);
//   });
//   return nameListHashMap;
// }

// function useUserNameInput() {
//   const [userNameInput, setUserNameInput] = useState<InputInfos>({
//     name: "",
//     surname: "",
//     selectedId: undefined,
//   });

//   function setUserNameInputByChange(
//     name: "name" | "surname" | "selectedId",
//     value: string,
//     nameList?: UserName[]
//   ) {
//     switch (name) {
//       case "name":
//         setUserNameInput({
//           name: value,
//           surname: userNameInput.surname,
//           selectedId: userNameInput.selectedId,
//         });
//         return;
//       case "surname":
//         setUserNameInput({
//           name: userNameInput.name,
//           surname: value,
//           selectedId: userNameInput.selectedId,
//         });
//         return;
//       case "selectedId":
//         const matchedName = nameList!.find((name) => name.id === value); //assume , there is always at least a user name.
//         setUserNameInput({
//           name: matchedName ? matchedName.name : "",
//           surname: matchedName ? matchedName.surname : "",
//           selectedId: value,
//         });
//         return;
//       default:
//         assertNever(name);
//     }
//   }
//   return [userNameInput, setUserNameInputByChange] as const;
// }

// function assertNever(value: never | string): never {
//   throw new Error(`value should not exist ${value}`);
// }
