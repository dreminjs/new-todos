import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable(),
  username: z.string()
});

export const updateUserDtoSchema = userSchema.pick({
  lastName: true,
  firstName: true,
  username: true
}).partial()

export const usernameQueryParamsSchema = userSchema.pick({
  username: true
})

export const checkUsernameAvailableResult = z.object({
  availabel: z.boolean()
})
