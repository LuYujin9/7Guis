import { z } from "zod";
export const userSchema = z.object({
  name: z.string(),
  surname: z.string(),
  id: z.string(),
});
export const usersSchema = z.array(userSchema);
export const idSchema = z.object({ id: z.string() });
