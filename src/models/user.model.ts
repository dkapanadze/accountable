import mongoose, { Schema, Document } from "mongoose";

export enum RoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  VERIFIED = "VERIFIED",
}

export interface IUser extends Document {
  id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  password: string;
  role: RoleEnum;
  address: string;
  phone: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,

      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(StatusEnum),
      default: StatusEnum.ACTIVE,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      required: true,
      default: RoleEnum.USER,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
