const router = require('express').Router();
const { createNote, getNoteById, updateNote, deleteNote } = require('../models/note.model');

router.route('/').get(async (req, res) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  try {
    const newNote = await createNote({ title, content });
    res.json('Note added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const note = await getNoteById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json('Note not found');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').delete(async (req, res) => {
  try {
    await deleteNote(req.params.id);
    res.json('Note deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/update/:id').post(async (req, res) => {
  const updatedData = {
    title: req.body.title,
    content: req.body.content,
  };

  try {
    const updatedNote = await updateNote(req.params.id, updatedData);
    res.json('Note updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
