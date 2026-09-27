const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A note title is required"],
      trim: true,
      maxlength: [100, "The title cannot exceed 100 characters"]
    },

    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
      maxlength: [5000, "The note cannot exceed 5000 characters"]
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Note", noteSchema);