import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Skeleton,
  Box
} from '@mui/material';
import WhatsAppOutlined from '@ant-design/icons/WhatsAppOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import PropTypes from 'prop-types';
import { useSnackbar } from 'react-simple-snackbar';
import axios from '../../utils/axios';

const CustomerDetailDialog = ({ open, onClose, customerId }) => {
  const [openSnackbar] = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (open && customerId) {
      fetchDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customerId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/customers/${customerId}`);
      setCustomer(response.data.customer);
      setOrders(response.data.orders || []);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  const digitsOnly = (phone) => (phone || '').replace(/\D/g, '');

  const handleWhatsApp = () => {
    const digits = digitsOnly(customer?.phone);
    if (!digits) return;
    window.open(`https://wa.me/${digits}`, '_blank');
  };

  const handleCopyPhone = async () => {
    if (!customer?.phone) return;
    try {
      await navigator.clipboard.writeText(customer.phone);
      openSnackbar('Phone number copied');
    } catch (error) {
      openSnackbar('Could not copy phone number');
    }
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      <DialogTitle>{customer?.name || 'Customer Details'}</DialogTitle>
      <DialogContent>
        {loading && (
          <Stack spacing={1}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" height={120} />
          </Stack>
        )}
        {!loading && customer && (
          <>
            <Stack spacing={0.5} sx={{ mb: 2 }}>
              <Typography variant="body1">Phone: {customer.phone}</Typography>
              <Typography variant="body1">CNIC: {customer.cnic || 'N/A'}</Typography>
              {customer.notes && <Typography variant="body2" color="text.secondary">Notes: {customer.notes}</Typography>}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Tooltip title="Open in WhatsApp">
                <IconButton color="success" onClick={handleWhatsApp}>
                  <WhatsAppOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy phone number">
                <IconButton color="primary" onClick={handleCopyPhone}>
                  <CopyOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Purchase History</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Sell Price</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ py: 2 }}>
                          <Typography variant="body2" color="text.secondary">No purchases yet</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.brand}</TableCell>
                      <TableCell>{order.model}</TableCell>
                      <TableCell>
                        <Chip size="small" label={order.type} color={order.type === 'new' ? 'success' : 'warning'} />
                      </TableCell>
                      <TableCell>{order.sellPrice}</TableCell>
                      <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

CustomerDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default CustomerDetailDialog;
