const express = require('express');
const cors = require('cors');
const fileUploadRoutes = require('./routes/fileUploadRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/upload', fileUploadRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the CSV Upload Service');
  });

  

module.exports = app;