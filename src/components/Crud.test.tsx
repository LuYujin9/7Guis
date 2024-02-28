import { render, screen } from "@testing-library/react";
import { Button, Crud, User, UserOption, filterUserList } from "./Crud";
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

describe("Button component", () => {
  it("Button component should render with correct text and trigger onClick function when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button name="Create" onClick={handleClick} isDisabled={false} />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Create");
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
  it("should not trigger onClick function when isDisabled is true", async () => {
    const handleClick = vi.fn();
    render(<Button name="Create" onClick={handleClick} isDisabled={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Create");
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
  it("should render with red hover and focus style when isDeleteButton is true", async () => {
    const handleClick = vi.fn();
    render(
      <Button
        name="Create"
        onClick={handleClick}
        isDisabled={false}
        isDeleteButton={true}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-[#FE9191]");
    expect(button).toHaveClass("focus:bg-[#FEACAC]");
    expect(button).not.toHaveClass("hover:bg-[#DDE5DE]");
    expect(button).not.toHaveClass("focus:bg-[#C7DAC9]");
  });
});

test("UserOption component renders with correct text", () => {
  const user = { name: "Jane", surname: "Davis", id: "0" };
  render(<UserOption user={user} />);
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

  it("should render disabled Create button, when user inputs are empty", async () => {
    render(<Crud users={users} />);
    const createButton = screen.getByLabelText(/create/i);
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    expect(createButton).toHaveAttribute("disabled");
    await userEvent.type(nameInput, "John");
    await userEvent.type(surnameInput, "Wilson");
    expect(createButton).not.toHaveAttribute("disabled");
    await userEvent.clear(nameInput);
    await userEvent.clear(surnameInput);
    expect(createButton).toHaveAttribute("disabled");
  });
  it("should render disabled Update button, when user inputs are empty or an user is not selected", async () => {
    render(<Crud users={users} />);
    const updateButton = screen.getByLabelText(/update/i);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    expect(updateButton).toHaveAttribute("disabled");
    await userEvent.type(nameInput, "John");
    await userEvent.type(surnameInput, "Wilson");
    expect(updateButton).toHaveAttribute("disabled");
    await userEvent.selectOptions(listBox, "1");
    await userEvent.clear(nameInput);
    await userEvent.clear(surnameInput);
    expect(updateButton).toHaveAttribute("disabled");
  });
  it("should render disabled Delete button, when a user is not selected", () => {
    render(<Crud users={users} />);
    const deleteButton = screen.getByLabelText(/delete/i);
    expect(deleteButton).toHaveAttribute("disabled");
  });
  it("should correctly filter the user list based on a case-insensitive filter", async () => {
    render(<Crud users={users} />);
    const filterInput = screen.getByLabelText("Filter:");
    await userEvent.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByText("John, Wilson")).toHaveValue("1");
    await userEvent.clear(filterInput);
    await userEvent.type(filterInput, "r");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByText("Jack, Roman")).toHaveValue("2");
    expect(screen.getByText("Emily, Roe")).toHaveValue("3");
  });

  it("should clear user inputs and remove selection when the selected user is not in the filtered user list", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const filterInput = screen.getByLabelText("Filter:");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    await userEvent.selectOptions(listBox, "0");
    expect(nameInput).toHaveValue("Jane");
    expect(surnameInput).toHaveValue("Davis");
    await userEvent.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(listBox.value).toBeUndefined;
    expect(nameInput).toHaveValue("");
    expect(surnameInput).toHaveValue("");
  });
  it("should keep the selection and user inputs when the id is in the filtered user list", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const filterInput = screen.getByLabelText("Filter:");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    await userEvent.selectOptions(listBox, "3");
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
    await userEvent.type(filterInput, "ro");
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
  });
  it("should update the user inputs when the value in them changed", async () => {
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    await userEvent.selectOptions(listBox, "3");
    expect(nameInput).toHaveValue("Emily");
    expect(surnameInput).toHaveValue("Roe");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Bella");
    await userEvent.clear(surnameInput);
    await userEvent.type(surnameInput, "Roman");
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
    const filterInput = screen.getByLabelText("Filter:");
    const createButton = screen.getByLabelText(/create/i);
    await userEvent.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.type(nameInput, "Bella");
    await userEvent.type(surnameInput, "Roman");
    await userEvent.click(createButton);
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
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const nameInput = screen.getByLabelText("Name:");
    const surnameInput = screen.getByLabelText("Surname:");
    const filterInput = screen.getByLabelText("Filter:");
    const updateButton = screen.getByLabelText(/update/i);
    await userEvent.type(filterInput, "wI");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.selectOptions(listBox, "1");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Bella");
    await userEvent.clear(surnameInput);
    await userEvent.type(surnameInput, "Roman");
    await userEvent.click(updateButton);
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
    render(<Crud users={users} />);
    const listBox = screen.getByLabelText<HTMLSelectElement>("user list box");
    const deleteButton = screen.getByLabelText(/delete/i);
    await userEvent.selectOptions(listBox, "2");
    await userEvent.click(deleteButton);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.queryAllByText("Jack, Roman")).toHaveLength(0);
    expect(screen.getByText("The user is deleted")).toBeInTheDocument();
  });
});
