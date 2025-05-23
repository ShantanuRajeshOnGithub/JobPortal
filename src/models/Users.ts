// models/User.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  accountType: "candidate" | "employee";
  acceptedTerms: boolean;
  resetToken:string;
  resetTokenExpiry:Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    required: true,
    enum: ["candidate", "employee"],
  },
  acceptedTerms: { type: Boolean, required: true },
  resetToken:{
    type:String,
    required:false
  },
  resetTokenExpiry:{
    type:Date,
    required:false
  }
});

export default models.User || model<IUser>("User", UserSchema);
