import mongoose, { isValidObjectId } from "mongoose";
import { Library } from "../models/library.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getLibraryBooks = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  if (!isValidObjectId(libraryId)) {
    throw new ApiError(400, "Invalid library ID");
  }

  const library = await Library.findById(libraryId).populate("books", [
    "title",
    "authorId",
    "borrowerId",
    "isAvailable",
  ]);
  if (!library) {
    throw new ApiError(404, "Library not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, library.books, "Books fetched successfully", true)
    );
});

const addBookToLibrary = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  const { bookId } = req.body;
  if (!isValidObjectId(libraryId)) {
    throw new ApiError(400, "Invalid library ID");
  }

  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can modify library inventory");
  }

  const addBook = await Library.findByIdAndUpdate(
    libraryId,
    { $addToSet: { books: bookId } },
    { new: true }
  ).populate({
    path: "books",
    select: "title authorId borrowerId isAvailable",
    populate: {
      path: "authorId",
      select: "username",
    },
  });

  if (!addBook) {
    throw new ApiError(404, "Library not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, addBook, "Book added successfully", true));
});

const removeBookFromLibrary = asyncHandler(async (req, res) => {
  const { libraryId, bookId } = req.params;
  if (!isValidObjectId(libraryId)) {
    throw new ApiError(400, "Invalid library ID");
  }

  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can modify library inventory");
  }

  const removeBook = await Library.findByIdAndUpdate(
    libraryId,
    { $pull: { books: bookId } },
    { new: true }
  ).populate({
    path: "books",
    select: "title authorId borrowerId isAvailable",
    populate: {
      path: "authorId",
      select: "username",
    },
  });

  if (!removeBook) {
    throw new ApiError(404, "Library not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, removeBook, "Book removed successfully", true));
});

export { getLibraryBooks, addBookToLibrary, removeBookFromLibrary };
