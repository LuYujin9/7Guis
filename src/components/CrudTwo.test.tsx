import { renderHook } from "@testing-library/react";
import { filterUserList, useIdAndInputsState } from "./CrudTwo";
import { describe, expect, test } from "vitest";
import { act } from "react-dom/test-utils";

test("filterUserList returns a filtered name list, case-insensitive", () => {
  const userList = [
    { name: "Jane", surname: "Davis", id: "0" },
    { name: "John", surname: "Wilson", id: "1" },
    { name: "Jack", surname: "Roman", id: "2" },
    { name: "Isabella", surname: "White", id: "3" },
    { name: "Jane", surname: "Davis", id: "4" },
    { name: "John", surname: "wilson", id: "5" },
    { name: "Jack", surname: "Roman", id: "6" },
    { name: "Isabella", surname: "white", id: "7" },
  ];
  const filteredUserListOne = filterUserList("w", userList);
  const filteredUserListTwo = filterUserList("W", userList);

  expect(filteredUserListOne).toStrictEqual([
    { name: "John", surname: "Wilson", id: "1" },
    { name: "Isabella", surname: "White", id: "3" },
    { name: "John", surname: "wilson", id: "5" },
    { name: "Isabella", surname: "white", id: "7" },
  ]);
  expect(filteredUserListOne).toStrictEqual(filteredUserListTwo);

  const filteredUserListThree = filterUserList("wH", userList);
  const filteredUserListFour = filterUserList("Wh", userList);
  expect(filteredUserListThree).toStrictEqual([
    { name: "Isabella", surname: "White", id: "3" },
    { name: "Isabella", surname: "white", id: "7" },
  ]);
  expect(filteredUserListThree).toStrictEqual(filteredUserListFour);
});

describe("useIdAndInputsState", () => {
  const userList = [
    { name: "Jane", surname: "Davis", id: "0" },
    { name: "John", surname: "Wilson", id: "1" },
    { name: "Jack", surname: "Roman", id: "2" },
  ];
  test("handleIdAndInputsChange changed the both states, when id is in userList or changes to undefined", async () => {
    const { result } = renderHook(() => useIdAndInputsState());
    const [selectedId, userInputs, handleIdAndInputsChange] = result.current;
    expect(selectedId).toStrictEqual(undefined);
    expect(userInputs).toStrictEqual({
      name: "",
      surname: "",
    });
    act(() => {
      handleIdAndInputsChange("1", userList);
    });
    const [updatedSelectedId1, updatedUserInputs1, handleIdAndInputsChange1] =
      result.current;
    expect(updatedSelectedId1).toStrictEqual("1");
    expect(updatedUserInputs1).toStrictEqual({
      name: "John",
      surname: "Wilson",
    });
    act(() => {
      handleIdAndInputsChange1("2", userList);
    });
    const [updatedSelectedId2, updatedUserInputs2, handleIdAndInputsChange2] =
      result.current;
    expect(updatedSelectedId2).toStrictEqual("2");
    expect(updatedUserInputs2).toStrictEqual({
      name: "Jack",
      surname: "Roman",
    });
    act(() => {
      handleIdAndInputsChange2(undefined, userList);
    });
    const [updatedSelectedId3, updatedUserInputs3, ,] = result.current;
    expect(updatedSelectedId3).toStrictEqual(undefined);
    expect(updatedUserInputs3).toStrictEqual({
      name: "",
      surname: "",
    });
  });
  test("handleInputsChange changes the userInputs, but does not effect the selectedId", async () => {
    const { result } = renderHook(() => useIdAndInputsState());
    const [
      selectedId,
      userInputs,
      handleIdAndInputsChange,
      handleInputsChange,
    ] = result.current;
    expect(selectedId).toStrictEqual(undefined);
    expect(userInputs).toStrictEqual({
      name: "",
      surname: "",
    });
    act(() => {
      handleInputsChange("name", "Jane");
    });
    const [
      updatedSelectedId1,
      updatedUserInputs1,
      handleIdAndInputsChange1,
      handleInputsChange1,
    ] = result.current;
    expect(updatedSelectedId1).toStrictEqual(undefined);
    expect(updatedUserInputs1).toStrictEqual({
      name: "Jane",
      surname: "",
    });
    act(() => {
      handleInputsChange1("surname", "Smith");
    });
    const [updatedSelectedId2, updatedUserInputs2] = result.current;
    expect(updatedSelectedId2).toStrictEqual(undefined);
    expect(updatedUserInputs2).toStrictEqual({
      name: "Jane",
      surname: "Smith",
    });
  });
});
