import authApihandler from "./src/controllers/auth/apiHandler.js";
import studentApiHandler from "./src/controllers/manageStudent/apiHandler.js";
// import register from "./src/controllers/auth/register.js"
export const router = (app) => {
  app.use("/api/auth", authApihandler);
  app.use("/api/student", studentApiHandler);

  // app.use("/api/auth", register);
};
