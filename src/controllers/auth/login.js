import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";
import teacherModel from "../../models/teacherModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";
import jwt from "jsonwebtoken";

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "username"));
    }
    if (!password || password === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "password"));
    }

    let userData = await teacherModel.findOne({
      $or: [{ phone: username }, { email: username }],
      isactive: STATE.ACTIVE,
    });

    if (userData && (await bcrypt.compare(password, userData.password))) {
      let token = jwt.sign(
        {
          id: userData._id,
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
        },
        process.env.SECRETKEY
      );

      // return send(res, RESPONSE.SUCCESS, { token, role: 1 });
      return send(res, RESPONSE.SUCCESS, token);
    } else {
      return send(res, setErrMsg  (RESPONSE.INVALID, "Login credential"));
    }
  } catch (error) {
    console.log("Login: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
