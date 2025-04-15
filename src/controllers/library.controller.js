import mongoose, { isValidObjectId } from "mongoose";
import { Library } from "../models/library.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createLibrary = asyncHandler(async (req, res) => {
  const { name, description, location } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  if (req.user.role !== "author") {
    throw new ApiError(403, "Only author can create library");
  }

  const library = await Library.create({ name, description, location });

  if (!library) {
    throw new ApiError(400, "Library not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, library, "Library created successfully", true));
});

const getAllLibraries = asyncHandler(async (req, res) => {
  const libraries = await Library.find().sort({ createdAt: -1 });

  if (!libraries) {
    throw new ApiError(404, "No libraries found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, libraries, "Libraries fetched successfully", true)
    );
});

const getLibraryById = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;

  if (!isValidObjectId(libraryId)) {
    throw new ApiError(400, "Invalid library ID");
  }

  const library = await Library.findById(libraryId).populate("books", [
    "title",
    "authorId",
    "borrowerId",
    "isAvailable ",
  ]);
  if (!library) {
    throw new ApiError(404, "Library not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, library, "Library fetched successfully", true));
});

const updateLibrary = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  const { name, description, location } = req.body;
  if (!isValidObjectId(libraryId)) {
    throw new ApiError(400, "Invalid library ID");
  }
  if (!name && !description && !location) {
    throw new ApiError(400, "Name, description or location is required");
  }
  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can modify library");
  }

  const updatedLibrary = await Library.findByIdAndUpdate(
    libraryId,
    {
      $set: {
        name,
        description,
        location,
      },
    },
    { new: true }
  );
  if (!updateLibrary) {
    throw new ApiError(400, "Library not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLibrary, "Library updated successfully", true)
    );
});

const deleteLibrary = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  if (!isValidObjectId(libraryId)) {
    throw new ApiError(400, "Invalid library ID");
  }
  if (req.user.role !== "author") {
    throw new ApiError(403, "Only authors can delete library");
  }

  const library = await Library.findByIdAndDelete(libraryId);
  if (!library) {
    throw new ApiError(404, "Library not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Library deleted successfully", true));
});

export {
  createLibrary,
  getAllLibraries,
  getLibraryById,
  updateLibrary,
  deleteLibrary,
};
