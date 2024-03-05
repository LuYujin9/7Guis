import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextInput } from "./TextInput";
import { DynamicButton } from "./DynamicButton";

export type User = {
  name: string;
  surname: string;
  id: string;
};
type UserInputsAndId = Omit<User, "id"> & { id: string | undefined };
type props = { users: User[] };
export function Crud({ users }: props) {
  const [userList, setUserList] = useState<User[]>(users);
  const [filterValue, setFilterValue] = useState<string>("");
  const [userInputsAndId, setUserInputsAndId] = useState<UserInputsAndId>({
    name: "",
    surname: "",
    id: undefined,
  });
  const [message, setMessage] = useState<string>("");
  const filteredUserList = filterUserList(filterValue, userList);

  function handleCreate() {
    const id = uuidv4();
    const newUser = {
      name: userInputsAndId.name,
      surname: userInputsAndId.surname,
      id: id,
    };
    setUserList([...userList, newUser]);
    setUserInputsAndId(newUser);
    setFilterValue("");
    setMessage(
      `The user ${userInputsAndId.name}, ${userInputsAndId.surname} is created`
    );
  }

  function handleUpdate() {
    if (
      userInputsAndId.id &&
      (userInputsAndId.name || userInputsAndId.surname)
    ) {
      const updatedUserList = userList.map((user) =>
        user.id !== userInputsAndId.id
          ? user
          : {
              ...user,
              name: userInputsAndId.name,
              surname: userInputsAndId.surname,
            }
      );
      setUserList(updatedUserList);
      setFilterValue("");
      setMessage(
        `The user ${userInputsAndId.name}, ${userInputsAndId.surname} is updated`
      );
      return;
    }
    throw new Error(
      `The update didn't go through successfully, the update button should have been disabled.`
    );
  }

  function handleDelete() {
    const updatedUserList = userList.filter(
      (user) => user.id !== userInputsAndId.id
    );
    setUserList(updatedUserList);
    setFilterValue("");
    setUserInputsAndId({
      name: "",
      surname: "",
      id: undefined,
    });
    setMessage("The user is deleted");
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterValue(e.target.value);
    const user = userList.find((user) => user.id === userInputsAndId.id);
    if (user && !isUserFiltered(e.target.value, user)) {
      setUserInputsAndId({
        name: "",
        surname: "",
        id: undefined,
      });
    }
  }

  return (
    <>
      <div className="grid grid-flow-row content-between w-[650px] h-[700px] rounded-[10px] m-auto p-7 bg-[#CDD3CE] ">
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
            onChange={(e) =>
              setUserInputsAndId(
                filteredUserList.find((user) => user.id === e.target.value)!
              )
            }
            aria-label="user list box"
            value={userInputsAndId.id}
          >
            {filteredUserList.map((user) => {
              return <UserOption key={user.id} user={user} />;
            })}
          </select>
          <div className="flex flex-col content-start gap-3">
            <TextInput
              children="Name:"
              name="name"
              value={userInputsAndId?.name ?? ""}
              onChange={(e) =>
                setUserInputsAndId({ ...userInputsAndId, name: e.target.value })
              }
            />
            <TextInput
              children="Surname:"
              name="surname"
              value={userInputsAndId?.surname ?? ""}
              onChange={(e) =>
                setUserInputsAndId({
                  ...userInputsAndId,
                  surname: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2">
          <DynamicButton
            name="Create"
            isDisabled={!userInputsAndId.name && !userInputsAndId.surname}
            onClick={handleCreate}
          />
          <DynamicButton
            name="Update"
            isDisabled={
              userInputsAndId.id === undefined ||
              (!userInputsAndId.name && !userInputsAndId.surname)
            }
            onClick={handleUpdate}
          />
          <DynamicButton
            isDeleteButton={true}
            name="Delete"
            onClick={handleDelete}
            isDisabled={userInputsAndId.id === undefined}
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
