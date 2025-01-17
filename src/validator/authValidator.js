import z from "zod";

// ====creating an object  schema========
const usersValidatorSchema = z.object({
  name: z
    .string({ required_error: "Name must be required." })
    .trim()
    .toLowerCase(),

  email: z
    .string({ required_error: "Email must be required" })
    .trim()
    .email({ message: "Invalid email" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 character" })
    .max(1024, { message: "Password can't be greater than 1024 character" }),
});

export default usersValidatorSchema;
