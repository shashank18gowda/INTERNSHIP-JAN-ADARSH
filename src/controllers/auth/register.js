import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";
import teacherModel from "../../models/teacherModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || name === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "name"));
    }
    if (!phone || phone === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "phone"));
    }
    if (!email || email === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "email"));
    }
    if (!password || password === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "password"));
    }
    const isPhone = phone.toString().match(/^([+]\91)\d{10}$/);

    if (!isPhone) {
      return send(res, setErrMsg(RESPONSE.INVALID, "phone"));
    }
    const isEmail = email.toString().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

    if (!isEmail) {
      return send(res, setErrMsg(RESPONSE.INVALID, "phone"));
    }

    let isPhoneExists = await teacherModel.findOne({
      phone,
      isactive: STATE.ACTIVE,
    });

    if (isPhoneExists) {
      return send(res, setErrMsg(RESPONSE.ALREADY_EXIST, "phone"));
    }

    let isEmailExists = await teacherModel.findOne({
      email,
      isactive: STATE.ACTIVE,
    });

    if (isEmailExists) {
      return send(res, setErrMsg(RESPONSE.ALREADY_EXIST, "email"));
    }

    let encryptedPassword = await bcrypt.hash(
      password,
      Number(process.env.HASHROUND)
    );

    await teacherModel.create({
      name,
      phone,
      email,
      password: encryptedPassword,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("Register: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
