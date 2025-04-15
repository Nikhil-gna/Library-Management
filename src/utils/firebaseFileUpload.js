import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/firebase.js";

export const uploadFileToFirebase = async (file, folder = "uploads") => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const localFilePath = path.join("public", "temp", file.filename);
  const destination = `${folder}/${Date.now()}_${file.originalname}`;
  const token = uuidv4();

  await bucket.upload(localFilePath, {
    destination,
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;

  fs.unlink(localFilePath, (err) => {
    if (err) console.error("Failed to delete temp file:", err);
  });

  return publicUrl;
};
