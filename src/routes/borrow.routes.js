import { Router } from "express";
import {
  getBorrowedBooks,
  borrowBook,
  returnBook,
} from "../controllers/borrow.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt);

router.route("/").get(getBorrowedBooks).post(borrowBook);
router.route("/:borrowId").put(returnBook);

export default router;
