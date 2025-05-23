import mongoose, { isValidObjectId } from "mongoose";
import { Book } from "../models/book.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFileToFirebase } from "../utils/firebaseFileUpload.js";

const createBook = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can create books");
  }

  const coverImageLocal = req.file;

  let imageUrl = process.env.DEFAULT_BOOK_COVER_URL;

  if (coverImageLocal) {
    imageUrl = await uploadFileToFirebase(coverImageLocal, "bookCovers");
  }

  const book = await Book.create({
    title,
    description,
    authorId: req.user._id,
    bookCoverImgUrl: imageUrl,
  });
  if (!book) {
    throw new ApiError(400, "Book not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, book, "Book created successfully", true));
});

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  if (!books) {
    throw new ApiError(404, "No books found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully", true));
});

const getBookById = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;
  if (!isValidObjectId(bookId)) {
    throw new ApiError(400, "Invalid book ID");
  }

  const book = await Book.findById(bookId).populate("authorId", ["username"]);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully", true));
});

const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  if (!isValidObjectId(bookId)) {
    throw new ApiError(400, "Invalid book ID");
  }

  const { title, description } = req.body;
  if (!title && !description) {
    throw new ApiError(400, "Title and description are required");
  }
  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can update books");
  }

  const book = await Book.findByIdAndUpdate(
    bookId,
    { title, description },
    { new: true }
  );
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book updated successfully", true));
});

const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  if (!isValidObjectId(bookId)) {
    throw new ApiError(400, "Invalid book ID");
  }
  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can remove books");
  }

  const deletedBook = await Book.findByIdAndDelete(bookId);
  if (!deletedBook) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedBook, "Book deleted successfully", true));
});

export { createBook, getBooks, getBookById, updateBook, deleteBook };
