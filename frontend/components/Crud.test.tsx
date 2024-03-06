import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
import { Crud, User, UserOption, filterUserList } from "./Crud";
import { describe, expect, it, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

test("filterUserList should  return a case-insensitive filtered name list", () => {
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

test("UserOption component renders with correct text", () => {
  const user = { name: "Jane", surname: "Davis", id: "0" };
  const screen = render(<UserOption user={user} />);
  const option = screen.getByRole("option");
  expect(option).toHaveTextContent("Jane, Davis");
});

describe("Crud component", () => {
  const users: User[] = [
    { name: "Jane", surname: "Davis", id: "0" },
    { name: "John", surname: "Wilson", id: "1" },
    { name: "Jack", surname: "Roman", id: "2" },
    { name: "Emily", surname: "Roe", id: "3" },
  ];
  function renderCrud() {
    const user = userEvent.setup();
    const screen = render(<Crud users={users} />);
    return { user: user, screen };
  }

  it("should render disabled Create button, when user inputs are empty", async () => {
    const { user } = renderCrud();
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname:/i });
    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toHaveAttribute("disabled");
    await user.type(nameInput, "John");
    await user.type(surnameInput, "Wilson");
    expect(createButton).not.toHaveAttribute("disabled");
    await user.clear(nameInput);
    await user.clear(surnameInput);
    expect(createButton).toHaveAttribute("disabled");
  });
  it("should render disabled Update button, when user inputs are empty or an user is not selected", async () => {
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box");
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname/i });
    const updateButton = screen.getByRole("button", { name: /update/i });
    expect(updateButton).toHaveAttribute("disabled");
    await user.type(nameInput, "John");
    await user.type(surnameInput, "Wilson");
    expect(updateButton).toHaveAttribute("disabled");
    await user.selectOptions(listBox, "1");
    await user.clear(nameInput);
    await user.clear(surnameInput);
    expect(updateButton).toHaveAttribute("disabled");
  });
  it("should render disabled Delete button, when a user is not selected", () => {
    const { screen } = renderCrud();
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toHaveAttribute("disabled");
  });
  it("should correctly filter the user list based on a case-insensitive filter", async () => {
    const { user } = renderCrud();
    const filterInput = screen.getByLabelText("Filter:");
    await user.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByText("John, Wilson")).toHaveValue("1");
    await user.clear(filterInput);
    await user.type(filterInput, "r");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByText("Jack, Roman")).toHaveValue("2");
    expect(screen.getByText("Emily, Roe")).toHaveValue("3");
  });

  it("should clear user inputs and remove selection when the selected user is not in the filtered user list", async () => {
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box") as HTMLSelectElement;
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname:/i });
    const filterInput = screen.getByLabelText("Filter:");
    await user.selectOptions(listBox, "0");
    expect(nameInput).toHaveValue("Jane");
    expect(surnameInput).toHaveValue("Davis");
    await user.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(listBox.value).toBeUndefined;
    expect(nameInput).toHaveValue("");
    expect(surnameInput).toHaveValue("");
  });
  it("should keep the selection and user inputs when the id is in the filtered user list", async () => {
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box");
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname:/i });
    const filterInput = screen.getByLabelText("Filter:");
    await user.selectOptions(listBox, "3");
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
    await user.type(filterInput, "ro");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
  });
  it("should update the user inputs when the value in them changed", async () => {
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box");
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname:/i });
    await user.selectOptions(listBox, "3");
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
    await user.clear(nameInput);
    await user.type(nameInput, "Bella");
    await user.clear(surnameInput);
    await user.type(surnameInput, "Roman");
    expect(nameInput).toHaveValue("Bella");
    expect(surnameInput).toHaveValue("Roman");
  });
  it("should add a new user to the list, select the new user, and retain user inputs, when a new user is created", async () => {
    vi.mock("uuid", () => {
      return {
        v4: vi.fn(() => "4"),
      };
    });
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box");
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname:/i });
    const filterInput = screen.getByLabelText("Filter:");
    const createButton = screen.getByRole("button", { name: /create/i });
    await user.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.type(nameInput, "Bella");
    await user.type(surnameInput, "Roman");
    await user.click(createButton);
    expect(screen.getAllByRole("option")).toHaveLength(5);
    expect(nameInput).toHaveValue("Bella");
    expect(surnameInput).toHaveValue("Roman");
    expect(screen.getByText("Bella, Roman")).toHaveValue("4");
    expect(listBox).toHaveValue("4");
    expect(
      screen.getByText("The user Bella, Roman is created")
    ).toBeInTheDocument();
  });
  it("should update the user list with retained selection and user, when a user is updated ", async () => {
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box");
    const nameInput = screen.getByRole("textbox", { name: "Name:" });
    const surnameInput = screen.getByRole("textbox", { name: /Surname:/i });
    const filterInput = screen.getByLabelText("Filter:");
    const updateButton = screen.getByRole("button", { name: /update/i });
    await user.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.selectOptions(listBox, "1");
    await user.clear(nameInput);
    await user.type(nameInput, "Bella");
    await user.clear(surnameInput);
    await user.type(surnameInput, "Roman");
    await user.click(updateButton);
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(nameInput).toHaveValue("Bella");
    expect(surnameInput).toHaveValue("Roman");
    expect(screen.getByText("Bella, Roman")).toHaveValue("1");
    expect(listBox).toHaveValue("1");
    expect(
      screen.getByText("The user Bella, Roman is updated")
    ).toBeInTheDocument();
  });
  it("should update the user list, when a user is deleted", async () => {
    const { user } = renderCrud();
    const listBox = screen.getByLabelText("user list box");
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.selectOptions(listBox, "2");
    await user.click(deleteButton);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.queryAllByText("Jack, Roman")).toHaveLength(0);
    expect(screen.getByText("The user is deleted")).toBeInTheDocument();
  });
});
