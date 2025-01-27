import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";
import { authenticate } from "../../middleware/authenticate.js";

router.delete("/", authenticate, async (req, res) => {
  try {
    const student_id = req.query.student_id;

    if (!student_id || student_id === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "student_id"));
    }

    let studentData = await studentModel.findOne({
      _id: student_id,
      isactive: STATE.ACTIVE,
    });

    if (!studentData) {
      return send(res, setErrMsg(RESPONSE.NOT_FOUND, "student data"));
    }

    await studentModel.updateOne(
      {
        _id: student_id,
      },
      {
        $set: { isactive: STATE.INACTIVE },
      }
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log("delete student: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
