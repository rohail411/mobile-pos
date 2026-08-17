import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Toolbar,
  Chip,
  MenuItem,
  Grid,
  Skeleton,
  Typography,
  Box
} from '@mui/material';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import axios from '../../utils/axios';
import OrderViewDialog from 'components/OrderViewDialog/OrderViewDialog';

const OrdersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('desc');
  const [dateFilter, setDateFilter] = useState({year: true});
  const [showViewOrder, setShowViewOrder] = useState({open: false, data: {}});

  useEffect(() => {
      getProducts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, dateFilter]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/orders', {params: {order: order, ...dateFilter}});
      setData(response.data.orders || []);
    } catch (error) {
      // keep previous data on failure
    } finally {
      setLoading(false);
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    (row.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('/api/v1/orders/download-report', {params: {order: order, ...dateFilter}});
      const pdfPath = response.data.pdfPath;
      window.open(pdfPath, '_blank');
    } catch (error) {
      // ignore, nothing to open
    }
  }

  const handleViewOrder = (row) => {
    setShowViewOrder({open: true, data: row});
  }

  return (
    <Paper>
        {showViewOrder.open && <OrderViewDialog open={showViewOrder.open} product={showViewOrder.data} onClose={() => setShowViewOrder({open: false, data: {}})}/> }
      <Toolbar>
        <Grid container>
            <Grid item xs={12} sm={6}>

                </Grid>
                <Grid item xs={12} sm={6} style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                <TextField
          variant="outlined"
          placeholder="Search by Customer Name"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ marginRight: 2 }}
        />
        <TextField
            select
            margin="dense"
            name="Sort"
            label="Sort"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            sx={{ marginRight: 2 }}
            required
        >
            {[{value: 'desc', label: 'Desc'}, {value: 'asc', label: 'Asc'}].map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
            </TextField>
            <TextField
            select
            margin="dense"
            name="date"
            label="Date Filter"
            value={Object.keys(dateFilter)[0]}
            onChange={(e) => setDateFilter({[e.target.value]: true})}
            sx={{ marginRight: 2 }}
            required
        >
            {[{value: 'week', label: 'Week'}, {value: 'month', label: 'Month'}, {value: 'year', label: 'Year'}].map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
            </TextField>
        <Button variant="contained" color="primary" onClick={handleDownloadReport}>Download Report</Button>
                </Grid>
        </Grid>

      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Sold Price</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                {Array.from({ length: 8 }).map((__, cellIdx) => (
                  <TableCell key={cellIdx}><Skeleton variant="text" /></TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 4 }}>
                    <FileTextOutlined style={{ fontSize: 28, opacity: 0.4 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      No sales recorded yet
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading && filteredData.map((row, i) => (
              <TableRow key={row.id ?? i}>
                <TableCell>{i+1}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell >{row.price}</TableCell>
                <TableCell>{row.sellPrice}</TableCell>

                {row.type==='new' ? <TableCell><Chip label={row.type} color="success" /></TableCell>:
                <TableCell><Chip label={row.type} color="warning" /></TableCell>}
                <TableCell>{row.customer?.name || '-'}</TableCell>
                <TableCell>
                  <Button variant='outlined' startIcon={<EyeOutlined />} onClick={()=> handleViewOrder(row)} color='info'>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrdersTable;
