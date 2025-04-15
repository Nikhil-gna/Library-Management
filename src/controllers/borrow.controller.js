import { isValidObjectId } from "mongoose";
import { Book } from "../models/book.model.js";
import { BorrowRecord } from "../models/borrowRecord.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const borrowBook = asyncHandler(async (req, res) => {
  const { bookId, charge } = req.body;

  if (!isValidObjectId(bookId)) {
    throw new ApiError(400, "Invalid book ID");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  console.log(book.isAvailable, "Book availability status");
  if (!book.isAvailable) {
    throw new ApiError(400, "Book is currently unavailable");
  }

  book.isAvailable = false;
  book.borrowerId = req.user._id;
  await book.save();

  const borrowRecord = await BorrowRecord.create({
    bookId,
    borrowerId: req.user._id,
    borrowDate: new Date(),
    charge,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, borrowRecord, "Book borrowed successfully", true)
    );
});

const returnBook = asyncHandler(async (req, res) => {
  const { borrowId } = req.params;

  if (!isValidObjectId(borrowId)) {
    throw new ApiError(400, "Invalid borrow record ID");
  }

  const borrowRecord = await BorrowRecord.findById(borrowId);
  if (!borrowRecord) {
    throw new ApiError(404, "Borrow record not found");
  }

  if (borrowRecord.returnDate) {
    throw new ApiError(400, "Book has already been returned");
  }

  borrowRecord.returnDate = new Date();
  await borrowRecord.save();

  const book = await Book.findById(borrowRecord.bookId);
  if (book) {
    book.isAvailable = true;
    book.borrowerId = null;
    await book.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, borrowRecord, "Book returned successfully", true)
    );
});

const getBorrowedBooks = asyncHandler(async (req, res) => {
  const borrowedBooks = await BorrowRecord.find({
    borrowerId: req.user._id,
  }).populate({
    path: "bookId",
    select: "title description authorId isAvailable",
    populate: {
      path: "authorId",
      select: "username",
    },
  });

  if (!borrowedBooks) {
    throw new ApiError(404, "No borrowed books found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, borrowedBooks, "Borrowed books fetched", true));
});

export { borrowBook, returnBook, getBorrowedBooks };
