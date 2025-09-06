// models/User.js
import mongoose, { Mongoose } from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },


  //  OTP Verification
  resetOTP:{type:String},
  expiresOTP:{type:Date},
  isOTPVerified:{type:Boolean,default:false}
},{timestamps:true});

const User = model("User", UserSchema);
export default User;
