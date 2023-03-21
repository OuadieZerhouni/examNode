const express = require('express');
const app = express();
const path = require('path');
const TaskRoute=require('./routes/Task')


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use('/',TaskRoute)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});