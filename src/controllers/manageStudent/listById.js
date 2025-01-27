import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { STATE } from "../../config/constant.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrMsg } from "../../helper/responseHelper.js";
import { authenticate } from "../../middleware/authenticate.js";

// router.get("/:student_id?/:teacher_id?", authenticate, async (req, res) => {//req.params
router.get("/", authenticate, async (req, res) => {
  try {
    // const student_id = req.params.student_id;

    const student_id = req.query.student_id;

    if (!student_id || student_id === undefined) {
      return send(res, setErrMsg(RESPONSE.REQUIRED, "student_id"));
    }

    let studentData = await studentModel.findOne({
      isactive: STATE.ACTIVE,
      _id: student_id,
    });

    if (!studentData) {
      return send(res, setErrMsg(RESPONSE.NOT_FOUND, "Student data"));
    }

    return send(res, RESPONSE.SUCCESS, studentData);
  } catch (error) {
    console.log("list student: ", error);
    return send(res, RESPONSE.UNKNWN_ERR);
  }
});

export default router;
