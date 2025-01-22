import z from "zod";

// ====creating an object  schema========
const usersValidatorSchema = z.object({
  name: z
    .string({ required_error: "Name must be required." })
    .min(1, { message: "Name must be at least 1 character" })
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

  role: z.enum(["admin", "user"], { required_error: "Role must be required" }),
});

export default usersValidatorSchema;
