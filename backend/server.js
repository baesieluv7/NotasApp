const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const options = {
    dbName: 'Notas',
  };

mongoose.connect(process.env.MONGODB_URI, options)
    .then(() => console.log("Conectado a MongoDB en la base de datos Notas"))
    .catch((error) => console.error(error));

const connection = mongoose.connection;

const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});