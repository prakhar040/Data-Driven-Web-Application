import React, { useState, useEffect } from 'react';
import { Button, TextField, LinearProgress, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import axios from 'axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [subscriptionPrice, setSubscriptionPrice] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (file) {
      setUploadedData([]);
      setPageCount(1);
      setCurrentPage(1);
    }
  }, [file]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setSubscriptionPrice(response.data.subscriptionPrice);
      setPageCount(response.data.pageCount);
      setCurrentPage(response.data.currentPage);
      setUploadedData(response.data.data);
    } catch (error) {
      setError('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUploadedData(newPage);
  };

  const fetchUploadedData = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/upload?page=${page}`);
      setUploadedData(response.data.data);
      setPageCount(response.data.pageCount);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching uploaded data:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <TextField
        type="file"
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleFileUpload} disabled={loading}>
        {uploadProgress ? 'Uploading...' : 'Upload CSV'}
      </Button>

      {uploadProgress > 0 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary" align="center">Upload Progress: {`${uploadProgress}%`}</Typography>
        </Box>
      )}

      {subscriptionPrice && (
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          Subscription Price: ${subscriptionPrice}
        </Typography>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {uploadedData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Column 1</TableCell>
                  <TableCell>Column 2</TableCell>
                  {/* Add more columns as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.column1}</TableCell>
                    <TableCell>{row.column2}</TableCell>
                    {/* Render other columns */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 2 }}>{currentPage} / {pageCount}</Typography>
            <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;