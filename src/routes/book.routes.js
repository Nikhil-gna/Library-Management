import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/").get(getBooks).post(upload.single("bookCover"), createBook);
router.route("/:bookId").get(getBookById).put(updateBook).delete(deleteBook);

export default router;
