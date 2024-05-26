const fs = require('fs');
const { parse } = require('csv-parse');
const { io } = require('../server');

const handleFileUpload = (req, res) => {
  const file = req.file;
  const results = [];

  fs.createReadStream(file.path)
    .pipe(parse({ columns: true }))
    .on('data', (data) => {
      results.push(data);
      // Emit progress to client
      io.emit('uploadProgress', { progress: results.length });
    })
    .on('end', () => {
      // Optionally save results to DB
      res.json({ message: 'File processed successfully', data: results });
    });
};

module.exports = { handleFileUpload };