import mongoose, { Schema } from "mongoose";

const TodoSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export const Todo = mongoose.model("Todo", TodoSchema);
