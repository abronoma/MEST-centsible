import { mongoose, Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: ""
  }  
});

userSchema.plugin(normalize);
export const userModel = model("User", userSchema);