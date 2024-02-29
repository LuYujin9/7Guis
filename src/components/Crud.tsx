import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextInput } from "./TextInput";

export type User = {
  name: string;
  surname: string;
  id: string;
};
type UserInputs = Omit<User, "id">;
type props = { users: User[] };
export function Crud({ users }: props) {
  const [userList, setUserList] = useState<User[]>(users);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [userInputs, setUserInputs] = useState<UserInputs>({
    name: "",
    surname: "",
  });
  const [message, setMessage] = useState<string>("");

  const filteredUserList = filterUserList(filterValue, userList);

  function handleCreate() {
    const id = uuidv4();
    const newName = {
      name: userInputs.name,
      surname: userInputs.surname,
      id: id,
    };
    setUserList([...userList, newName]);
    setSelectedId(id);
    setFilterValue("");
    setMessage(`The user ${userInputs.name}, ${userInputs.surname} is created`);
  }

  function handleUpdate(selectedId: string | undefined) {
    if (selectedId && (userInputs.name || userInputs.surname)) {
      const updatedUserList = users.map((user) =>
        user.id !== selectedId
          ? user
          : { ...user, name: userInputs.name, surname: userInputs.surname }
      );
      setUserList(updatedUserList);
      setFilterValue("");
      setMessage(
        `The user ${userInputs.name}, ${userInputs.surname} is updated`
      );
    }
  }

  function handleDelete(selectedId: string | undefined) {
    const updatedUserList = users.filter((user) => user.id !== selectedId);
    setUserList(updatedUserList);
    setFilterValue("");
    setSelectedId(undefined);
    setUserInputs({
      name: "",
      surname: "",
    });
    setMessage("The user is deleted");
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(e.target.value);
    const user = userList.find((user) => user.id === selectedId);
    if (user && !isUserFiltered(e.target.value, user)) {
      setSelectedId(undefined);
      setUserInputs({
        name: "",
        surname: "",
      });
    }
  }

  return (
    <>
      <div className="grid grid-flow-row content-between w-[600px] h-[617px] rounded-[10px] m-auto p-7 bg-[#CDD3CE] ">
        <div>
          <TextInput
            children="Filter:"
            name="filter"
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex flex-row justify-between gap-4 text-sm">
          <select
            className="w-[261px] h-[397px] border-2 rounded-[5px]  border-black shadow-[5px_5px_4px_0px] shadow-gray-400"
            size={15}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setUserInputs(
                filteredUserList!.find((user) => user.id === e.target.value)!
              );
            }}
            aria-label="user list box"
            value={selectedId}
          >
            {filteredUserList.map((user) => {
              return <UserOption key={user.id} user={user} />;
            })}
          </select>
          <div className="flex flex-col content-start gap-3">
            <TextInput
              children="Name:"
              name="name"
              value={userInputs?.name ?? ""}
              onChange={(e) =>
                setUserInputs({ ...userInputs, name: e.target.value })
              }
            />
            <TextInput
              children="Surname:"
              name="surname"
              value={userInputs?.surname ?? ""}
              onChange={(e) =>
                setUserInputs({ ...userInputs, surname: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            name="Create"
            isDisabled={!userInputs.name && !userInputs.surname}
            onClick={() => handleCreate()}
          />
          <Button
            name="Update"
            isDisabled={
              selectedId === undefined ||
              (!userInputs.name && !userInputs.surname)
            }
            onClick={() => handleUpdate(selectedId)}
          />
          <Button
            isDeleteButton={true}
            name="Delete"
            onClick={() => handleDelete(selectedId)}
            isDisabled={selectedId === undefined}
          />
        </div>
      </div>
      <p>{message}</p>
    </>
  );
}

function isUserFiltered(input: string, user: User) {
  return user?.surname.toLowerCase().startsWith(input.toLowerCase());
}

export function filterUserList(input: string, list: User[]) {
  return list.filter((user) => isUserFiltered(input, user));
}

export function UserOption({ user }: { user: User }) {
  return (
    <option className="text-left pl-2" value={user.id}>
      {user.name}, {user.surname}
    </option>
  );
}

export function Button({
  name,
  onClick,
  isDisabled,
  isDeleteButton,
}: {
  name: string;
  onClick: () => void;
  isDisabled: boolean;
  isDeleteButton?: boolean;
}) {
  return (
    <button
      className={`flex-auto h-12 border-2 rounded-[5px] bg-[#F5F5F5]  border-black shadow-[5px_5px_4px_0px]
       shadow-gray-400 text-gray-700 disabled:text-slate-400 ${
         isDeleteButton
           ? "hover:bg-[#FE9191] focus:bg-[#FEACAC]"
           : "hover:bg-[#DDE5DE] focus:bg-[#C7DAC9]"
       }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {name}
    </button>
  );
}
