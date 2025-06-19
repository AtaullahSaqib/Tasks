const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 5000

// Create file 
app.get('/create/:username', (req, res) => {
  const filename = `${req.params.username}.txt`;
  try {
    fs.writeFileSync(filename, `This is ${req.params.username}'s file.\n`);
    res.send(`File created: ${filename}`);
  } catch (err) {
    res.status(500).send('Error creating file');
  }
});

// Read file
app.get('/read/:username', (req, res) => {
  const filename = `${req.params.username}.txt`;
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) return res.send('File not found');
    res.send(`<pre>File Content:\n\n${data}</pre>`);
  });
});

// Update file 
app.get('/update/:username', (req, res) => {
  const filename = `${req.params.username}.txt`;
  const updateText = `Appended on ${new Date().toLocaleString()}\n`;
  try {
    fs.appendFileSync(filename, updateText);
    res.send(`File updated: ${filename}`);
  } catch (err) {
    res.send('Cannot update. File may not exist.');
  }
});

// Delete file
app.get('/delete/:username', (req, res) => {
  const filename = `${req.params.username}.txt`;
  fs.unlink(filename, (err) => {
    if (err) return res.send('File not found or already deleted');
    res.send(`File deleted: ${filename}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
