import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//userSchema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    refreshTokens: [
      {
        token: String,
        expireAt: Date,
      },
    ],
  },
  { timestamps: true }
);

//hashing password before saving to the db
userSchema.pre("save", async function (next) {
  //if password is not modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//comparing password
userSchema.methods.comparePassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
