import { Router } from "express";
import {
  createLibrary,
  getAllLibraries,
  getLibraryById,
  updateLibrary,
  deleteLibrary,
} from "../controllers/library.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt);

router.route("/").get(getAllLibraries).post(createLibrary);
router
  .route("/:libraryId")
  .get(getLibraryById)
  .put(updateLibrary)
  .delete(deleteLibrary);

export default router;
