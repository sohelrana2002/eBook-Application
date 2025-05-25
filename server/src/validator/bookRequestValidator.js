import z from "zod";

const bookRequestValidatorSchema = z.object({
  userId: z.string({ required_error: "User Id must be required." }).optional(),

  bookName: z
    .string({ required_error: "Bookname must be required." })
    .min(1, { message: "Bookname must be at least 1 character" })
    .trim()
    .toLowerCase(),

  authorName: z
    .string({ required_error: "Author name must be required." })
    .min(1, { message: "Author name must be at least 1 character" })
    .trim()
    .toLowerCase(),

  publicationDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date({ invalid_type_error: "Publication date must be a valid date" })
  ),

  language: z
    .string({ required_error: "Language must be required." })
    .min(1, { message: "Language must be at least 1 character" })
    .trim()
    .toLowerCase(),

  status: z
    .enum(["pending", "in-progress", "added", "not-found"], {
      required_error: "status must be required",
    })
    .default("pending"),
});

const bookRequestUpdateSchema = bookRequestValidatorSchema.partial();

export { bookRequestValidatorSchema, bookRequestUpdateSchema };
