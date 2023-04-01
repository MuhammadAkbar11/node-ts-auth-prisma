import z from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "Name is required",
      }),
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(6, "Passowrd to short"),
      passwordConfirmation: z.string({
        required_error: "Confirm Password is required",
      }),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Not a valid Email"),
      role: z
        .string({
          required_error: "Email is required",
        })
        .optional(),
    })
    .refine(data => data.password == data.passwordConfirmation, {
      message: "Password do not match!",
      path: ["passwordConfirmation"],
    }),
});

export type CreateUserInput = Omit<
  z.TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
