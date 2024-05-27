const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const app = express();
const port = 5000;
const upload = multer({ dest: 'uploads/' });

app.use(cors());

const calculateSubscriptionPrice = (data) => {
  const BasePrice = 100;
  const PricePerCreditLine = 10;
  const PricePerCreditScorePoint = 0.5;

  let totalCreditLines = 0;
  let totalCreditScore = 0;

  data.forEach(row => {
    totalCreditLines += parseInt(row.CreditLines);
    totalCreditScore += parseInt(row.CreditScore);
  });

  const subscriptionPrice = BasePrice + (PricePerCreditLine * totalCreditLines) + (PricePerCreditScorePoint * totalCreditScore);
  return subscriptionPrice;
};

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  let data = [];
  fs.createReadStream(filePath)
    .pipe(parse({ columns: true }))
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      fs.unlinkSync(filePath); // Clean up after processing
      console.log('File processed successfully');
      const subscriptionPrice = calculateSubscriptionPrice(data);
      const pageSize = 10; // Number of items per page
      const pageCount = Math.ceil(data.length / pageSize);
      const paginatedData = data.slice(0, pageSize); // First page of data
      res.status(200).json({ 
        data: paginatedData, 
        pageCount, 
        currentPage: 1, 
        subscriptionPrice 
      });
    })
    .on('error', (error) => {
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Error processing file' });
    });
});

app.get('/api/upload', (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const data = []; // Retrieve data from storage

  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedData = data.slice(startIdx, endIdx);
  const pageCount = Math.ceil(data.length / pageSize);

  res.status(200).json({
    data: paginatedData,
    pageCount,
    currentPage: parseInt(page, 10),
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
