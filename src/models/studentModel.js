import mongoose, { Schema } from "mongoose";

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: false,
  },
  teacher_id: {
    type: Schema.Types.ObjectId,
    ref: "teachers",
    required: false,
  },
  isactive: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("students", studentSchema);
