const Note = require("../models/Note");

async function getNotes(req, res) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    const notes = await Note.find({
      owner: req.currentUser._id
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve notes"
    });
  }
}

async function createNote(req, res) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    const { title, content } = req.body;

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A title and note content are required"
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      owner: req.currentUser._id
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note
    });
  } catch (error) {
    console.error("Create note error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create the note"
    });
  }
}

module.exports = {
  getNotes,
  createNote
};