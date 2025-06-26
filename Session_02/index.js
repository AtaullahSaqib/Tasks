const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 5000

//add log file

fs.writeFileSync("./logger.txt", "Welcome to log file!")
function logToFile(message) {
  const time = new Date().toLocaleString();
  const logMessage = `[${time}] ${message}\n`;
  fs.appendFileSync('logger.txt', logMessage);
}

// Create file 
app.get('/create/:username', (req, res, next) => {
  const filename = `${req.params.username}.txt`;
  try {
    fs.writeFileSync(filename, `This is ${req.params.username}'s file.\n`);
    res.send(`File created: ${filename}`);
  } catch (err) {
    next(err);
  }
});

// Read file
app.get('/read/:username', (req, res, next) => {
  const filename = `${req.params.username}.txt`;
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) return res.send('File not found');
    res.send(`<pre>File Content:\n\n${data}</pre>`);
  });
});

// Update file 
app.get('/update/:username', (req, res, next) => {
  const filename = `${req.params.username}.txt`;
  const updateText = `Appended on ${new Date().toLocaleString()}\n`;
  try {
    fs.appendFileSync(filename, updateText);
    res.send(`File updated: ${filename}`);
  } catch (err) {
    next(err);
  }
});

// Delete file
app.get('/delete/:username', (req, res, next) => {
  const filename = `${req.params.username}.txt`;
  fs.unlink(filename, (err) => {
    if (err) return res.send('File not found or already deleted');
    res.send(`File deleted: ${filename}`);
  });
});

//global err handling
app.use((err, req, res, next) => {
  logToFile(`Error on ${req.method} ${req.url} → ${err.message}`);
  res.status(500).send(`Something went wrong! ERROR: ${err.message}`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
