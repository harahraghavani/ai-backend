const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MESSAGE_SCHEMA = new Schema({
  isUser: {
    type: Boolean,
    required: true, // Ensure it's always specified
  },
  text: {
    type: String,
    trim: true, // Removes unnecessary spaces
  },
  timestamp: {
    type: Date,
    default: Date.now, // Stores the current date/time as a timestamp
    immutable: true, // Prevents modification after creation
  },
});

const TEXT_CONVERSION_SCHEMA = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    messages: {
      type: [MESSAGE_SCHEMA], // Array of messages
      default: [], // Ensures it starts as an empty array
    },
  },
  {
    versionKey: false, // This will remove the `__v` field
    timestamps: true, // This will add `createdAt` and `updatedAt` fields0
  }
);

const TextConversion = mongoose.model("TextConversion", TEXT_CONVERSION_SCHEMA);

module.exports = TextConversion;
