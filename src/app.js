import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import healthCheck from "./routes/healthcheck.routes.js";
import libraryRouter from "./routes/library.routes.js";
import bookRouter from "./routes/book.routes.js";
import libraryInventoryRouter from "./routes/libraryInventory.routes.js";
import borrowRouter from "./routes/borrow.routes.js";

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the BookKeeping Service Home",
  });
});

app.use("/api/v1/healthcheck", healthCheck);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/libraries", libraryRouter);
app.use("/api/v1/libraries", libraryInventoryRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrow", borrowRouter);

export { app };
