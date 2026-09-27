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

    const { title, content } = req.body || {};

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

async function getNoteById(req, res) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.currentUser._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error("Get note error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the note"
    });
  }
}

async function updateNote(req, res) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    const { title, content } = req.body || {};
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "The title cannot be empty"
        });
      }

      updates.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          success: false,
          message: "The note content cannot be empty"
        });
      }

      updates.content = content.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a title or content to update"
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.currentUser._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    console.error("Update note error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update the note"
    });
  }
}

async function deleteNote(req, res) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.currentUser._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Delete note error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete the note"
    });
  }
}

module.exports = {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote
};
