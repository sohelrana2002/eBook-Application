import mongoose from "mongoose";
import slugify from "slugify";

const bookSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
    },

    genre: {
      type: Array,
      required: true,
    },

    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    publicationDate: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    tags: {
      type: [String],
      required: true,
      lowercase: true,
    },

    coverImage: {
      type: String,
      required: false,
    },

    bookFile: {
      type: String,
      required: false,
    },

    averageRating: { type: Number, default: 0 },

    isOscar: {
      type: Boolean,
      default: false,
    },

    isNovel: {
      type: Boolean,
      default: false,
    },

    isShortStory: {
      type: Boolean,
      default: false,
    },

    isPoetry: {
      type: Boolean,
      default: false,
    },

    isKidsBook: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

bookSchema.pre("validate", async function (next) {
  if (this.title && !this.slug) {
    const baseSlug = slugify(this.title, {
      lower: true,
      locale: "bn", // keep Bengali characters
      remove: /[*+~.()'"!:@?`#$%^&={}<>[\]\\\/,_|]/g,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.book.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

const booksModel = new mongoose.model("book", bookSchema);

export default booksModel;
