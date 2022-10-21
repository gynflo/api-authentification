import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./user.interface";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    local: {
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      isCheckEmail: {
        type: Boolean,
        required: true,
        default: false,
      },
      emailToken: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      passwordToken: {
        type: String,
      },
      passwordTokenExpiration: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// HashPassword

UserSchema.pre<User>("save", async function (next) {
  //Returns true if any of the given paths ("local.password") are modified, else false.
  if (!this.isModified("local.password")) {
    next();
  }

  const hashedPassword = await bcrypt.hash(this.local.password, 10);
  this.local.password = hashedPassword;
  next();
});

//ComparePassword
UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Boolean | Error> {
  return await bcrypt.compare(password, this.local.password);
};

export default model<User>("user", UserSchema);
