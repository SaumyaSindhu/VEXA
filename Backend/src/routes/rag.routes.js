import { Router } from "express";
import multer from "multer";
import { uploadPDFController } from "../controllers/rag.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const ragRouter = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

ragRouter.post("/upload", authUser, upload.single("file"), uploadPDFController);

export default ragRouter;