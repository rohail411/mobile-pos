import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Toolbar,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Skeleton,
  Typography,
  Box,
  Stack
} from '@mui/material';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import { useSnackbar } from 'react-simple-snackbar';
import axios from '../../utils/axios';
import CustomerDetailDialog from 'components/CustomerDetailDialog/CustomerDetailDialog';

const Customers = () => {
  const [openSnackbar] = useSnackbar();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [showDetail, setShowDetail] = useState({ open: false, id: null });
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Re-applies the URL's ?search= when it changes without the component
  // remounting — e.g. using the header search again while already here.
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
    setDebouncedSearch(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/customers', { params: { search: debouncedSearch || undefined } });
      setData(response.data.customers || []);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
    // openSnackbar's identity changes on every render (react-simple-snackbar
    // does not memoize it) — omitting it here avoids an infinite fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/v1/customers/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      openSnackbar('Failed to export customers');
    }
  };

  const handleView = (row) => {
    setShowDetail({ open: true, id: row.id });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Box>
          <Typography variant="h5">Customers</Typography>
          <Typography variant="body2" color="text.secondary">
            Everyone who has bought a phone from you, with WhatsApp contact and purchase history
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          {showDetail.open && (
            <CustomerDetailDialog
              open={showDetail.open}
              customerId={showDetail.id}
              onClose={() => setShowDetail({ open: false, id: null })}
            />
          )}
          <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            <TextField
              variant="outlined"
              placeholder="Search by name, phone or CNIC"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ marginRight: 2, minWidth: 260 }}
            />
            <Button variant="outlined" startIcon={<DownloadOutlined />} onClick={handleExport}>
              Export CSV
            </Button>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>CNIC</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    {Array.from({ length: 6 }).map((__, cellIdx) => (
                      <TableCell key={cellIdx}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))}
                {!loading && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No customers yet
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && data.map((row, i) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.cnic || '-'}</TableCell>
                    <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton size="small" color="primary" onClick={() => handleView(row)}>
                            <EyeOutlined />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Customers;
