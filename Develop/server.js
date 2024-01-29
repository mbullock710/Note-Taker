const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html')); 
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

const dbFilePath = path.join(__dirname, '/db/db.json')

let idCounter = 1

app.get('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = idCounter++;

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});