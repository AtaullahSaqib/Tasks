const express = require('express')

const app = express()

const port = 5000

app.use(express.json());

const users = [];

app.post('/users', (req, res) => {
  const { name, age } = req.body;

  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a non-empty string' });
  }

  if (typeof age !== 'number' || age <= 0) {
    return res.status(400).json({ error: 'Age must be a positive number' });
  }

  const duplicate = users.some(user => user.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    return res.status(409).json({ error: 'User with this name already exists' });
  }

  const newUser = { name, age };
  users.push(newUser);

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);S
});
