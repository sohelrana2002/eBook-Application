import z from "zod";

const contactValidatorSchema = z.object({
  email: z
    .string({ required_error: "Email must be required!" })
    .email({ message: "Invalid email!" }),
  message: z
    .string({ required_error: "Message is required!" })
    .min(3, { message: "message at least 3 character!" })
    .trim()
    .toLowerCase(),
});

export default contactValidatorSchema;
