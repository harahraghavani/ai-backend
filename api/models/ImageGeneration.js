const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IMAGE_GENERATION_SCHEMA = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    prompt: {
      type: String,
      required: true,
      trim: true, // Removes unnecessary spaces
    },
    image: {
      type: {
        asset_id: {
          type: String,
        },
        width: {
          type: Number,
        },
        public_id: {
          type: String,
        },
        height: {
          type: Number,
        },
        url: {
          type: String,
        },
        secure_url: {
          type: String,
        },
        display_name: {
          type: String,
        },
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false, // This will remove the `__v` field
    timestamps: true, // This will add `createdAt` and `updatedAt` fields0
  }
);

const ImageGeneration = mongoose.model(
  "ImageGeneration",
  IMAGE_GENERATION_SCHEMA
);

module.exports = ImageGeneration;
