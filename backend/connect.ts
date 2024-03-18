import path, { dirname } from "node:path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const filePath = path.join(__dirname, "/../data/users.json");
