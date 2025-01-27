import multer from "multer";
import { send, setErrMsg } from "../helper/responseHelper.js";
import { RESPONSE } from "../config/global.js";

const storage = multer.diskStorage({
  destination: "./public/uploads",

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    let ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    cb(null, uniqueSuffix + ext);
  },
});

let maxSize = 2 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (
    !file.mimetype.includes("image/jpeg") &&
    !file.mimetype.includes("image/jpg") &&
    !file.mimetype.includes("image/png")
  ) {
    return cb(null, false, new Error("Only JPG/PNG/JPEG file allowed"));
  }
  cb(null, true);
};

const images = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter,
});

export default images;
