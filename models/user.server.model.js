import { Schema, model } from "mongoose";

const User = Schema({
  userName: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  userType: {
    type: String,
    tim: true,
  },
  vitals: [
    {
      type: [String],
      ref: "vital",
      default: [],
    },
  ],
  checklist: [
    {
      type: [String],
      ref: "checklist",
      default: [],
    },
  ],
});

export default model("User", User);
