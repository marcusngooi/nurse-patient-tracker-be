import { Schema, model } from "mongoose";

const Tip = Schema({
  message: {
    type: String,
    trim: true,
  },
});

export default model("Tip", Tip);
