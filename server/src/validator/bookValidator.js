import z from "zod";

const booksValidatorSchema = z.object({
  title: z
    .string({ required_error: "Title must be required." })
    .trim()
    .toLowerCase()
    .min(3, { message: "Title must be at least 3 character long." }),

  author: z
    .string({ required_error: "Author must be required." })
    .trim()
    .toLowerCase()
    .min(3, { message: "Author must be at least 3 character long." }),

  description: z
    .string({ required_error: "Description must be required." })
    .trim()
    .toLowerCase()
    .min(3, { message: "Description must be at least 3 character long." }),

  genre: z.preprocess(
    (arg) => (typeof arg === "string" ? arg.split(",") : arg),
    z
      .array(z.string().min(1), {
        required_error: "Genre must be required.",
      })
      .min(1, "At least one genre is required")
      .max(5, "You can select up to 5 genres")
      .nonempty({ message: "Genres cannot be empty." })
  ),

  language: z
    .string({ required_error: "Language must be required." })
    .trim()
    .toLowerCase()
    .min(3, { message: "Language must be at least 1 character long." }),

  publicationDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date({ invalid_type_error: "Publication date must be a valid date" })
  ),

  price: z
    .string({
      required_error: "Price must be required.",
      invalid_type_error: "Price must be a number",
    })
    .optional(),

  tags: z.preprocess(
    (arg) => (typeof arg === "string" ? arg.split(",") : arg),
    z
      .array(z.string().min(1), {
        required_error: "Tags must be required.",
      })
      .nonempty("At least one tag is required")
  ),

  coverImage: z
    .string({ required_error: "CoverImage URL must be required." })
    .optional(),

  bookFile: z
    .string({ required_error: "bookFile URL must be required." })
    .optional(),

  averageRating: z
    .number({ required_error: "Calculate average rating" })
    .optional(),

  isOscar: z.preprocess(
    (val) => val === true || val === "true",
    z.boolean().default(false)
  ),

  isNovel: z.preprocess(
    (val) => val === true || val === "true",
    z.boolean().default(false)
  ),

  isShortStory: z.preprocess(
    (val) => val === true || val === "true",
    z.boolean().default(false)
  ),

  isPoetry: z.preprocess(
    (val) => val === true || val === "true",
    z.boolean().default(false)
  ),

  isKidsBook: z.preprocess(
    (val) => val === true || val === "true",
    z.boolean().default(false)
  ),
});

export default booksValidatorSchema;
