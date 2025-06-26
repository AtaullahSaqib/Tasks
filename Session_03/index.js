const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 5000

function logToFile(message) {
  const time = new Date().toLocaleString()       
  const logMessage = `[${time}] ${message}\n`   
  fs.appendFileSync('logger.txt', logMessage)    
}

app.get('/', (req, res, next) => {
  try {
    logToFile('Home route accessed')
    res.send('Welcome to the Server!')
  } catch (err) {
    next(err)
  }
})

app.get('/logs', (req, res, next) => {
  try {
    const logPath = path.join(__dirname, 'logger.txt')

    if (!fs.existsSync(logPath)) {
      return res.status(404).send('Log file not found')
    }

    res.sendFile(logPath)
    logToFile('Log file sent to client')
  } catch (err) {
    next(err)
  }
})

//Global Error Handler
app.use((err, req, res, next) => {
  const time = new Date().toLocaleString();
  const logMessage = `[${time}] ERROR: ${err.message}\n`;
  fs.appendFileSync('logger.txt', logMessage);

  res.status(500).send('Something went wrong on the server.');
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  logToFile('Server started')
})
