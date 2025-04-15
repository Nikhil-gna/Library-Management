import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookCoverImgUrl: {
      type: String,
      default: "https://example.com/default-cover.jpg",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
