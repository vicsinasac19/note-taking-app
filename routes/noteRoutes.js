const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

const router = express.Router();

router.use(requiresAuth());

router.get("/", getNotes);
router.post("/", createNote);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;