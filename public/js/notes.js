const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const formHeading = document.querySelector("#form-heading");
const saveButton = document.querySelector("#save-note-button");
const cancelButton = document.querySelector("#cancel-edit-button");
const message = document.querySelector("#note-message");
const notesList = document.querySelector("#notes-list");

let editingNoteId = null;

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);

  const data = await response.json().catch(() => ({
    message: "The server returned an unexpected response"
  }));

  if (!response.ok) {
    throw new Error(data.message || "The request failed");
  }

  return data;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "darkred" : "darkgreen";
}

function resetForm() {
  editingNoteId = null;
  noteForm.reset();
  formHeading.textContent = "Create a Note";
  saveButton.textContent = "Save Note";
  cancelButton.hidden = true;
}

function beginEditing(note) {
  editingNoteId = note._id;
  titleInput.value = note.title;
  contentInput.value = note.content;

  formHeading.textContent = "Edit Note";
  saveButton.textContent = "Update Note";
  cancelButton.hidden = false;

  noteForm.scrollIntoView({
    behavior: "smooth"
  });

  titleInput.focus();
}

async function deleteNote(note) {
  const confirmed = window.confirm(
    `Delete "${note.title}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const result = await apiRequest(`/api/notes/${note._id}`, {
      method: "DELETE"
    });

    if (editingNoteId === note._id) {
      resetForm();
    }

    showMessage(result.message);
    await loadNotes();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function renderNotes(notes) {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "You do not have any notes yet.";
    notesList.appendChild(emptyMessage);
    return;
  }

  notes.forEach((note) => {
    const article = document.createElement("article");
    article.className = "note-card";

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    const updated = document.createElement("small");
    updated.textContent =
      `Updated ${new Date(note.updatedAt).toLocaleString()}`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      beginEditing(note);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteNote(note);
    });

    article.append(
      heading,
      content,
      updated,
      editButton,
      deleteButton
    );

    notesList.appendChild(article);
  });
}

async function loadNotes() {
  try {
    const result = await apiRequest("/api/notes");
    renderNotes(result.notes);
  } catch (error) {
    notesList.textContent = error.message;
  }
}

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    showMessage("Enter a title and note content.", true);
    return;
  }

  const isEditing = Boolean(editingNoteId);
  const url = isEditing
    ? `/api/notes/${editingNoteId}`
    : "/api/notes";

  try {
    const result = await apiRequest(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        content
      })
    });

    resetForm();
    showMessage(result.message);
    await loadNotes();
  } catch (error) {
    showMessage(error.message, true);
  }
});

cancelButton.addEventListener("click", () => {
  resetForm();
  showMessage("");
});

loadNotes();
