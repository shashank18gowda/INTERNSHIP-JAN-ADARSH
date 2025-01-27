import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";
import { authenticate } from "../../middleware/authenticate.js";
//
import images from "../../middleware/uploads.js";
import multer from "multer";
const uploads = images.array("image");

router.post("/", authenticate, async (req, res) => {
  try {
    uploads(req, res, async (err) => {
      if (!req.files || req.files.length === 0) {
        return send(res, setErrMsg(RESPONSE.REQUIRED, "image"));
      }
      if (err instanceof multer.MulterError) {
        return send(res, setErrMsg(RESPONSE.MULTER_ERR, err));
      } else if (err) {
        return send(res, RESPONSE.UNKNWN_ERR);
      }

      let filename = [];

      req.files.forEach((ele) => {
        filename.push(ele.filename);
      });

      const { name, phone, rollno } = req.body;
      const teacher_id = req.user.id;

      if (!name || name === undefined) {
        return send(res, setErrMsg(RESPONSE.REQUIRED, "name"));
      }
      if (!phone || phone === undefined) {
        return send(res, setErrMsg(RESPONSE.REQUIRED, "phone"));
      }
      if (!rollno || rollno === undefined) {
        return send(res, setErrMsg(RESPONSE.REQUIRED, "rollno"));
      }

      const isPhone = phone.toString().match(/^([+]\91)\d{10}$/);

      if (!isPhone) {
        return send(res, setErrMsg(RESPONSE.INVALID, "phone"));
      }

      let isPhoneExists = await studentModel.findOne({
        phone,
        isactive: STATE.ACTIVE,
      });

      if (isPhoneExists) {
        return send(res, setErrMsg(RESPONSE.ALREADY_EXIST, "phone"));
      }

      let isRollnoExists = await studentModel.findOne({
        rollno,
        isactive: STATE.ACTIVE,
      });

      if (isRollnoExists) {
        return send(res, setErrMsg(RESPONSE.ALREADY_EXIST, "rollno"));
      }

      await studentModel.create({
        name,
        phone,
        rollno,
        teacher_id,
        image: filename,
      });

      return send(res, RESPONSE.SUCCESS);
    });
  } catch (error) {
    console.log("Add student: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
