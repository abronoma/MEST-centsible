import { mongoose, Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, unique: true}
});

userSchema.plugin(normalize);
export const userModel = model("User", userSchema);