import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";
import { authenticate } from "../../middleware/authenticate.js";

router.get("/", authenticate, async (req, res) => {
  try {
    // let studentData = await studentModel.findOne({
    //   isactive: STATE.ACTIVE,
    // });

    // let studentData = await studentModel.find({
    //   isactive: STATE.INACTIVE,
    // });

    let studentData = await studentModel.aggregate([
      {
        $match: {
          isactive: STATE.ACTIVE,
          //   teacher_id: req.user.id,
          $expr: { $eq: ["$teacher_id", { $toObjectId: req.user.id }] },
        },
      },
    ]);

    if (studentData.length == 0) {
      return send(res, setErrMsg(RESPONSE.NOT_FOUND, "Student data"));
    }

    studentData = studentData.map((itm) => {
      return {
        ...itm,
        image: itm.image.map((img) =>  `/uploads/${img}`),
      };
    });

    //
    return send(res, RESPONSE.SUCCESS, studentData);
  } catch (error) {
    console.log("list student: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
