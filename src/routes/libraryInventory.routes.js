import { Router } from "express";
import {
  getLibraryBooks,
  addBookToLibrary,
  removeBookFromLibrary,
} from "../controllers/libraryInventory.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt);

router
  .route("/:libraryId/inventory")
  .get(getLibraryBooks)
  .post(addBookToLibrary);

router.route("/:libraryId/inventory/:bookId").delete(removeBookFromLibrary);

export default router;
