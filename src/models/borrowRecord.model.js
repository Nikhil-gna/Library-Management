import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    charge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);
