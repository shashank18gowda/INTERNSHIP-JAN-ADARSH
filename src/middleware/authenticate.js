import { RESPONSE } from "../config/global.js";
import { send, setErrMsg } from "../helper/responseHelper.js";
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return send(res, RESPONSE.ACCESS_DENIED);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    return next();
  } catch (error) {
    return send(res, setErrMsg(RESPONSE.INVALID, "token"));
  }
  // return next();
};
