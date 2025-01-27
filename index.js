import express from "express";
const app = express();
import dotenv from "dotenv";
import path from "path";
let _dirname = path.resolve();

import { connectDB } from "./src/helper/dbConnection.js";
import { router } from "./route.js";
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(_dirname, "public")));

connectDB();
router(app);

app.listen(PORT, () => {
  console.log("Server listening on PORT:", PORT);
});
