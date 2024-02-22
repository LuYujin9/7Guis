import { filterUserList } from "./Crud";
import { expect, test } from "vitest";

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
  expect(filterUserList("w", userList)).toStrictEqual([
    { name: "John", surname: "Wilson", id: "1" },
    { name: "Isabella", surname: "White", id: "3" },
    { name: "John", surname: "wilson", id: "5" },
    { name: "Isabella", surname: "white", id: "7" },
  ]);
  expect(filterUserList("W", userList)).toStrictEqual(
    filterUserList("w", userList)
  );

  expect(filterUserList("wH", userList)).toStrictEqual([
    { name: "Isabella", surname: "White", id: "3" },
    { name: "Isabella", surname: "white", id: "7" },
  ]);
  expect(filterUserList("Wh", userList)).toStrictEqual(
    filterUserList("wH", userList)
  );
});
