("use strict");
import { build, idJsonSchema, userJsonSchema } from "./app";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { User } from "../frontend/components/Crud";

function mockAndSpyDatabase() {
  const getUsersData = vi.fn();
  const updateUsersData = vi.fn();
  const mockedDatabase = { getUsersData, updateUsersData };
  const spyOnGetUsersData = vi.spyOn(mockedDatabase, "getUsersData");
  const spyOnUpdateUsersData = vi.spyOn(mockedDatabase, "updateUsersData");
  return { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData };
}

describe("GET /api/users route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should send response with users data and http status code 200.", async () => {
    const users = [
      {
        name: "Jane",
        surname: "aaaa",
        id: "0",
      },
    ];
    const { mockedDatabase } = mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    mockedDatabase.getUsersData.mockResolvedValue(users);
    const response = await server.inject({ method: "GET", url: "/api/users" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(users);
  });
  it("should send response with status code 404 with wrong url.", async () => {
    const { mockedDatabase, spyOnGetUsersData } = mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "GET",
      url: "/wrongUrl/users",
    });
    expect(response.statusCode).toBe(404);
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
  });
  it("should send response with status code 500, when the database reject", async () => {
    const { mockedDatabase, spyOnGetUsersData } = mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    //问题: is it possible to  mock the reject value as a promise?

    // const rejectedPromise = Promise.reject({
    //   code: "ENOENT",
    //   message: "ENOENT: no such file or directory.",
    // });
    mockedDatabase.getUsersData.mockRejectedValue("rejected");
    // await expect(() =>
    //   server.inject({ method: "GET", url: "/api/users" })
    // ).rejects.toThrowError("ENOENT: no such file or directory.");
    const response = await server.inject({ method: "GET", url: "/api/users" });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
  });
});

describe("POST /api/users route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const originalUsers = [
    {
      name: "Jane",
      surname: "aaaa",
      id: "0",
    },
  ];
  const newUser = {
    name: "Jane",
    surname: "Smith",
    id: "2",
  };
  const updatedUsers = [...originalUsers, newUser];
  //问题: can I put them here? because i think the names of variables are clear.
  it("should send response with status code 201.", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "POST",
      url: "/api/users",
      body: newUser,
    });
    expect(response.statusCode).toBe(201);
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalledWith(updatedUsers);
  });
  it("should send response with status code 404 with wrong url.", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "POST",
      url: "/wrongUrl/users",
      body: newUser,
    });
    expect(response.statusCode).toBe(404);
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
  });
  it("should send response with status code 400 and the schema, when the body of request does not conform to the expected schema.", async () => {
    const invalidUser = {
      name: "Jane",
      id: "2",
    };
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "POST",
      url: "/api/users",
      body: invalidUser,
    });
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.schema).toStrictEqual(userJsonSchema);
  });
  it("should send response with status code 500, when the database reject", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    mockedDatabase.getUsersData.mockRejectedValue("rejected");
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const firstResponse = await server.inject({
      method: "POST",
      url: "/api/users",
      body: newUser,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(firstResponse.statusCode).toBe(500);
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockRejectedValue("rejected");
    const secondResponse = await server.inject({
      method: "POST",
      url: "/api/users",
      body: newUser,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalled();
    expect(secondResponse.statusCode).toBe(500);
  });
});

describe("PUT /api/users route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const originalUsers = [
    {
      name: "Jane",
      surname: "aaaa",
      id: "0",
    },
    {
      name: "John",
      surname: "Wilson",
      id: "1",
    },
  ];
  const updatedUser = {
    name: "Jane",
    surname: "Smith",
    id: "0",
  };

  it("should send response with status code 200.", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "PUT",
      url: "/api/users",
      body: updatedUser,
    });
    expect(response.statusCode).toBe(200);
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalled();
  });
  it("should send response with status code 404, when the user's id can't be found in database.", async () => {
    const userNotFoundById = {
      name: "Jane",
      surname: "Smith",
      id: "5",
    };
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "PUT",
      url: "/api/users",
      body: userNotFoundById,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(404);
  });
  it("should send response with status code 404 with wrong url.", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "PUT",
      url: "/wrongUrl/users",
      body: updatedUser,
    });
    expect(response.statusCode).toBe(404);
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
  });
  it("should send response with status code 400 and the schema, when the body of request does not conform to the expected schema.", async () => {
    const invalidUser = {
      name: "Jane",
      id: "2",
    };
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "PUT",
      url: "/api/users",
      body: invalidUser, //问题, 用payload也可以, 但是具体需要区分吗
    });
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.schema).toStrictEqual(userJsonSchema);
  });
  it("should send response with status code 500, when the database reject", async () => {
    const { mockedDatabase, spyOnGetUsersData } = mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    mockedDatabase.getUsersData.mockRejectedValue("rejected");
    const response = await server.inject({ method: "GET", url: "/api/users" });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(response.statusCode).toBe(500); //TO DO: how to do with a object reject ?
  });
  it("should send response with status code 500, when the database reject", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    mockedDatabase.getUsersData.mockRejectedValue("rejected");
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const firstResponse = await server.inject({
      method: "PUT",
      url: "/api/users",
      body: updatedUser,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(firstResponse.statusCode).toBe(500);
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockRejectedValue("rejected");
    const secondResponse = await server.inject({
      method: "PUT",
      url: "/api/users",
      body: updatedUser,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalled();
    expect(secondResponse.statusCode).toBe(500);
  });
});

describe("DELETE /api/users route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const originalUsers = [
    {
      name: "Jane",
      surname: "aaaa",
      id: "0",
    },
    {
      name: "John",
      surname: "Wilson",
      id: "1",
    },
  ];
  const idToDelete = { id: "0" };

  it("should send response with status code 200.", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "DELETE",
      url: "/api/users",
      body: idToDelete,
    });
    expect(response.statusCode).toBe(200);
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalled();
  });
  it("should send response with status code 404, when the user's id can't be found in database.", async () => {
    const IdNoInOriginalUsers = {
      id: "5",
    };
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "DELETE",
      url: "/api/users",
      body: IdNoInOriginalUsers,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(404);
  });
  it("should send response with status code 404 with wrong url.", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "DELETE",
      url: "/wrongUrl/users",
      body: idToDelete,
    });
    expect(response.statusCode).toBe(404);
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
  });
  it("should send response with status code 400 and the schema, when the body of request does not conform to the expected schema.", async () => {
    const invalidId = {
      id: 2,
    };
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    const server = build({}, mockedDatabase);
    const response = await server.inject({
      method: "DELETE",
      url: "/api/users",
      body: invalidId,
    });
    expect(spyOnGetUsersData).not.toHaveBeenCalled();
    expect(spyOnUpdateUsersData).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.schema).toStrictEqual(idJsonSchema);
  });
  it("should send response with status code 500, when the database reject", async () => {
    const { mockedDatabase, spyOnGetUsersData } = mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    mockedDatabase.getUsersData.mockRejectedValue("rejected");
    const response = await server.inject({ method: "GET", url: "/api/users" });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(response.statusCode).toBe(500); //TO DO: how to do with a object reject ?
  });
  it("should send response with status code 500, when the database reject", async () => {
    const { mockedDatabase, spyOnGetUsersData, spyOnUpdateUsersData } =
      mockAndSpyDatabase();
    const server = build({}, mockedDatabase);
    mockedDatabase.getUsersData.mockRejectedValue("rejected");
    mockedDatabase.updateUsersData.mockResolvedValue("success");
    const firstResponse = await server.inject({
      method: "DELETE",
      url: "/api/users",
      body: idToDelete,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(firstResponse.statusCode).toBe(500);
    mockedDatabase.getUsersData.mockResolvedValue(originalUsers);
    mockedDatabase.updateUsersData.mockRejectedValue("rejected");
    const secondResponse = await server.inject({
      method: "DELETE",
      url: "/api/users",
      body: idToDelete,
    });
    expect(spyOnGetUsersData).toHaveBeenCalled();
    expect(spyOnUpdateUsersData).toHaveBeenCalled();
    expect(secondResponse.statusCode).toBe(500);
  });
});
