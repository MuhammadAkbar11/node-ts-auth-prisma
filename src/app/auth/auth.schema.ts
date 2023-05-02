import z from "zod";

export const signUpUserSchema = z.object({
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

export const signInUserSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid Email"),
  }),
});

export type SignInUserPayload = Omit<
  z.TypeOf<typeof signInUserSchema>,
  "body.passwordConfirmation"
>;

export type SignUpUserPayload = Omit<
  z.TypeOf<typeof signUpUserSchema>,
  "body.passwordConfirmation"
>;
