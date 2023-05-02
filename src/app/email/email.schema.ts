import * as z from "zod";

export const emailSchema = z.object({
  body: z.object({
    to: z.string().email(),
    subject: z.string(),
    text: z.string(),
    html: z.string().optional(),
  }),
});

export type EmailPayload = z.infer<typeof emailSchema>;
