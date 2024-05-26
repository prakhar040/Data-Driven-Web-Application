import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';

const DataTable = ({ data }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const displayedRows = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ height: 400, width: '100%', mt: 4 }}>
      <DataGrid
        rows={displayedRows}
        columns={Object.keys(data[0] || {}).map(key => ({ field: key, headerName: key, width: 150 }))}
        pageSize={rowsPerPage}
        disableSelectionOnClick
        rowsPerPageOptions={[rowsPerPage]}
        hideFooter
      />
      <Pagination count={pageCount} page={page} onChange={handlePageChange} sx={{ mt: 2 }} />
    </Box>
  );
};

export default DataTable;