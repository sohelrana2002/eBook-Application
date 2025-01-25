import z from "zod";
const genreEnum = z.enum([
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Historical Fiction",
  "Biography",
  "Horror",
  "Poetry",
  "Drama",
  "Health",
]);

const booksValidatorSchema = z.object({
  title: z
    .string({ required_error: "Title must be required." })
    .trim()
    .toLowerCase(),

  author: z
    .string({ required_error: "Author must be required." })
    .trim()
    .toLowerCase(),

  description: z.string({ required_error: "Description must be required." }),

  genre: z
    .array(genreEnum, { required_error: "Genre must be required." })
    .min(1, "At least one genre is required")
    .max(5, "You can select up to 5 genres")
    .nonempty({ message: "Genres cannot be empty." }),

  language: z
    .string({ required_error: "Language must be required." })
    .trim()
    .toLowerCase(),

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

  tags: z.array(z.string(), { required_error: "tage must be required." }),

  coverImage: z
    .string({ required_error: "CoverImage URL must be required." })
    .optional(),

  bookFile: z
    .string({ required_error: "bookFile URL must be required." })
    .optional(),
});

export default booksValidatorSchema;
