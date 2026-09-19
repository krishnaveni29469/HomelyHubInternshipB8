// user Schema(nothing but design)

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { kMaxLength } from "node:buffer";
import { type } from "node:os";
import { settings } from "node:cluster";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your mail"],
      trim: true, //removes extra space
      maxLength: [50, "your name cannot be longer than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "please enter email ID"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter validate email address "],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the same !",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false, //when we fetch data from mongo db it doesn't shows the password beacuse of security
      index: true,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },

  { timestamps: true }, //when the user changed password the time will save
);
//settings to not pass in response from server

userSchema.set("toJSON", {
  //after sending the details from server to response then we delete the details in server like after changing the password
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordChangedAt;
    delete ret.passwordResetExpires;
    delete ret.__v; //mongo version number that we delete
    return ret;
  },
});

// password logic
//hashing
userSchema.pre("save", async function () {
  // "pre save" means it runs automatically before saving in database
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12); // convert a password to encrpt form like S@#$LK
  this.passwordConfirm = undefined; //password matches so we dont want to save in database while saveing
});

// login check(when user type "Krishna" while login now it encrpts "A@#$%!" ))
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword); // it compare the login password and register password like K!@@#$==K!@@#$
};

// for every login server gives a token,after changeing the password but gives old token it returns false
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      //used to convert into integer
      this.passwordChangedAt.getTime() / 1000, //milesecond/1000 to convert into sec beacause token stores sec
      10, //paass it in number
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};
// forgot password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
// the above design convert to working tool
const User = mongoose.model("User", userSchema);
//mongo convert User == user,it does automatically
export { User }; //{} means name must mach exactly
