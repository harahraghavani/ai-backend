const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const USER_SCHEMA = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false, // This will remove the `__v` field
    timestamps: true, // This will add `createdAt` and `updatedAt` fields0
  }
);

const User = mongoose.model("User", USER_SCHEMA);

module.exports = User;
