const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});