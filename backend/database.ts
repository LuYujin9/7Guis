import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { User } from "../frontend/components/Crud";

export type Database = {
  getUsersData: () => Promise<User[]>;
  updateUsersData: (updatedUsers: User[]) => Promise<string>;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "/../data/users.json");

async function getUsersData(): Promise<User[]> {
  const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
  return data;
} //问题:  should here use 'try catch', then return error, but it will be make the code in app.ts langer.

async function updateUsersData(updatedUsers: User[]): Promise<string> {
  const updatedData = new Uint8Array(
    Buffer.from(JSON.stringify(updatedUsers, undefined, 2))
  );
  const promise = await fs.writeFile(filePath, updatedData, "utf-8");
  if (promise === undefined) {
    return "success";
  }
  return "failure";
} //TO DO

export { getUsersData, updateUsersData };
