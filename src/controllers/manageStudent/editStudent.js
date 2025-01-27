import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";
import { authenticate } from "../../middleware/authenticate.js";

import images from "../../middleware/uploads.js";
import multer from "multer";
const uploads = images.array("image");

router.put("/", authenticate, async (req, res) => {
  try {
    uploads(req, res, async (err) => {
      // if (!req.files || req.files.length === 0) {
      //   return send(res, setErrMsg(RESPONSE.REQUIRED, "image"));
      // }
      if (err instanceof multer.MulterError) {
        return send(res, setErrMsg(RESPONSE.MULTER_ERR, err));
      } else if (err) {
        return send(res, RESPONSE.UNKNWN_ERR);
      }

      let updates = {};
      if (req.files != undefined) {
        let filename = [];
        req.files.forEach((ele) => {
          filename.push(ele.filename);
        });
      }

      const student_id = req.query.student_id;
      const { name, rollno, phone } = req.body;

      if (!student_id || student_id === undefined) {
        return send(res, setErrMsg(RESPONSE.REQUIRED, "student_id"));
      }

      if (name && name != undefined) {
        updates.name = name;
      }
      if (rollno && rollno != undefined) {
        updates.rollno = rollno;
      }
      if (phone && phone != undefined) {
        updates.phone = phone;
      }

      let studentData = await studentModel.findOne({
        _id: student_id,
        isactive: STATE.ACTIVE,
      });

      if (!studentData) {
        return send(res, setErrMsg(RESPONSE.NOT_FOUND, "student data"));
      }

      // console.log(updates);

      await studentModel.updateOne(
        {
          _id: student_id,
        },
        {
          $set: updates,
        }
      );

      return send(res, RESPONSE.SUCCESS);
    });
  } catch (error) {
    console.log("edit student: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
