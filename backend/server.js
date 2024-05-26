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

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check if the uploaded file is a CSV
  const fileMimeType = req.file.mimetype;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (fileMimeType !== 'text/csv' && fileExtension !== '.csv') {
    // Delete the uploaded file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Invalid file type. Please upload a CSV file.' });
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
      
      // Calculate subscription price
      const subscriptionPrice = calculateSubscriptionPrice(data);
      
      // Send response
      res.status(200).json({
        data,
        subscriptionPrice,
        pageCount: 1, // Assuming no pagination for now
        currentPage: 1,
      });
    })
    .on('error', (error) => {
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Error processing file' });
    });
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});