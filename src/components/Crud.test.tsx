import { render, screen } from "@testing-library/react";
import { Button, Crud, UserOption, filterUserList } from "./Crud";
import { describe, expect, it, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { User, UserList } from "../pages/CrudPage";

const user = userEvent.setup();

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

test("Button component should render with correct text and trigger onClick function when clicked", async () => {
  const handleClick = vi.fn();
  render(<Button name="Create" onClick={handleClick} />);
  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("Create");
  await user.click(button);
  expect(handleClick).toHaveBeenCalled();
});

test("UserOption component renders with correct text", () => {
  const user = { name: "Jane", surname: "Davis", id: "0" };
  render(<UserOption user={user} />);
  const option = screen.getByRole("option");
  expect(option).toHaveTextContent("Jane, Davis");
});

describe("Curd component", () => {
  const users: UserList<User> = [
    { name: "Jane", surname: "Davis", id: "0" },
    { name: "John", surname: "Wilson", id: "1" },
    { name: "Jack", surname: "Roman", id: "2" },
    { name: "Emily", surname: "Roe", id: "3" },
  ];

  it("should update user inputs when a user is selected from the user list", async () => {
    render(<Crud users={users} />);
    const userList = screen.getAllByRole("option");
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    await user.selectOptions(listBox, "1");
    expect(userList).toHaveLength(4);
    expect(listBox).toHaveValue("1");
    Q1: console.log(nameInput);
    expect(nameInput).toHaveValue("John");
    expect(surnameInput).toHaveValue("Wilson");
    await user.selectOptions(listBox, "2");
    expect(nameInput).toHaveValue("Jack");
    expect(surnameInput).toHaveValue("Roman");
  });

  it("should correctly filter the user list based on a case-insensitive filter prefix", async () => {
    render(<Crud users={users} />);
    const filterInput = screen.getByLabelText("Filter prefix:");
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
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const filterInput = screen.getByLabelText("Filter prefix:");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
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
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const filterInput = screen.getByLabelText("Filter prefix:");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    await user.selectOptions(listBox, "3");
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
    await user.type(filterInput, "ro");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
  });

  it("should update the user input when the value in input changed", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
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
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    const filterInput = screen.getByLabelText("Filter prefix:");
    const createButton = screen.getByLabelText(/create/i);
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
    expect(screen.getByText("The name is created")).toBeInTheDocument();
  });

  it("should display a error message, when user input is empty and create button is clicked", async () => {
    render(<Crud users={users} />);
    const createButton = screen.getByLabelText(/create/i);
    await user.click(createButton);
    expect(screen.getByText("Please give a name")).toBeInTheDocument();
  });

  it("should update the user list with retained selection and user, when a user is updated ", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    const filterInput = screen.getByLabelText("Filter prefix:");
    const updateButton = screen.getByLabelText(/update/i);
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
    expect(screen.getByText("The name is updated")).toBeInTheDocument();
  });

  it("should display a error message ,when user inputs are both empty or no user is selected and update button is clicked", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    const updateButton = screen.getByLabelText(/update/i);
    await user.type(nameInput, "Bella");
    await user.click(updateButton);
    expect(listBox).not.toHaveAttribute("value");
    expect(screen.getByText("Please select a name")).toBeInTheDocument();
    await user.selectOptions(listBox, "2");
    await user.clear(nameInput);
    await user.clear(surnameInput);
    await user.click(updateButton);
    expect(screen.getByText("Please give a name")).toBeInTheDocument();
  });

  it("should update the user list, when a user is deleted", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const deleteButton = screen.getByLabelText(/delete/i);
    await user.selectOptions(listBox, "2");
    await user.click(deleteButton);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.queryAllByText("Jack, Roman")).toHaveLength(0);
    expect(screen.getByText("The user is deleted")).toBeInTheDocument();
  });

  it("should display a error message, when no user is selected and delete button is clicked", async () => {
    render(<Crud users={users} />);
    const deleteButton = screen.getByLabelText(/delete/i);
    await user.click(deleteButton);
    expect(screen.getByText("Please select a name")).toBeInTheDocument();
  });
});
