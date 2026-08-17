import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Stack,
  Divider,
  Typography,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import WhatsAppOutlined from '@ant-design/icons/WhatsAppOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import axios from '../../utils/axios';
import { useSnackbar } from 'react-simple-snackbar';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const ProductSellForm = ({ open, handleClose, productType, data }) => {
  const [openSnackbar] = useSnackbar();
  const [formData, setFormData] = useState({
    price: '',
    customerName: '',
    customerPhone: '',
    customerCnic: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [returningCustomer, setReturningCustomer] = useState(null);
  const [saleResult, setSaleResult] = useState(null);
  const phoneDebounceRef = useRef(null);

  useEffect(() => {
    setFormData({
      price: '',
      customerName: '',
      customerPhone: '',
      customerCnic: ''
    });
    setReturningCustomer(null);
    setSaleResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    const phone = formData.customerPhone.trim();
    if (phone.length < 5) {
      setReturningCustomer(null);
      return undefined;
    }
    phoneDebounceRef.current = setTimeout(async () => {
      try {
        const response = await axios.get('/api/v1/customers', { params: { search: phone } });
        const match = (response.data.customers || []).find((c) => c.phone === phone) || (response.data.customers || [])[0];
        if (match) {
          setReturningCustomer(match);
          setFormData((prev) => ({ ...prev, customerName: prev.customerName || match.name }));
        } else {
          setReturningCustomer(null);
        }
      } catch (error) {
        // non-fatal: customer lookup is a UX convenience only
      }
      // openSnackbar is intentionally not used/depended on here to avoid
      // the react-simple-snackbar infinite-loop footgun.
    }, 400);
    return () => clearTimeout(phoneDebounceRef.current);
  }, [formData.customerPhone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const profit = formData.price !== '' && !Number.isNaN(Number(formData.price)) ? Number(formData.price) - Number(data.price || 0) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post('/api/v1/orders', {
        ...formData,
        type: productType,
        productId: data.id,
        brand: data.brandId?.name,
        model: data.model,
        price: data.price,
        sellPrice: formData.price
      });
      openSnackbar(response.data.message || 'Sale recorded successfully');
      setSaleResult({
        sellPrice: formData.price,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone
      });
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to record sale');
    } finally {
      setSubmitting(false);
    }
  };

  const digitsOnly = (phone) => (phone || '').replace(/\D/g, '');

  const handleWhatsApp = () => {
    const digits = digitsOnly(saleResult?.customerPhone);
    if (!digits) return;
    const message = `Hi ${saleResult.customerName || ''}, thank you for buying the ${data.brandId?.name || ''} ${data.model || ''} from us! Let us know if you need anything.`;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDone = () => {
    setSaleResult(null);
    handleClose();
  };

  if (saleResult) {
    return (
      <Dialog open={open} onClose={handleDone} maxWidth="xs" fullWidth>
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 3, textAlign: 'center' }}>
            <CheckCircleFilled style={{ fontSize: 48, color: '#2e7d32' }} />
            <Typography variant="h5">Sale completed</Typography>
            <Typography variant="body1" color="text.secondary">
              {data.brandId?.name} {data.model} sold for {currencyFormatter.format(Number(saleResult.sellPrice) || 0)}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button onClick={handleDone} variant="outlined" color="primary">
            Done
          </Button>
          <Button onClick={handleWhatsApp} variant="contained" color="success" startIcon={<WhatsAppOutlined />}>
            Message customer on WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ShoppingCartOutlined style={{ fontSize: 22 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">Complete Sale</Typography>
            <Typography variant="body2" color="text.secondary">
              Record this device as sold and capture the buyer&apos;s details
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <form id="sell-form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Typography variant="overline" color="text.secondary">
                Device
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1, p: 2, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Brand
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {data.brandId?.name}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Model
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {data.model}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    IMEI
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {data.imei}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Cost Price
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {currencyFormatter.format(Number(data.price) || 0)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="overline" color="text.secondary">
                Sale
              </Typography>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <TextField
                    margin="dense"
                    name="price"
                    label="Sell Price"
                    type="number"
                    fullWidth
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  {profit !== null && (
                    <Chip
                      size="small"
                      sx={{ mt: 0.5 }}
                      color={profit > 0 ? 'success' : 'error'}
                      label={profit > 0 ? `Profit: ${currencyFormatter.format(profit)}` : `Loss: ${currencyFormatter.format(Math.abs(profit))}`}
                    />
                  )}
                </Box>
                <Box>
                  <TextField
                    margin="dense"
                    name="customerPhone"
                    label="Customer Phone"
                    type="tel"
                    fullWidth
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                  />
                  {returningCustomer && (
                    <Chip size="small" color="info" sx={{ mt: 0.5 }} label={`Returning customer: ${returningCustomer.name}`} />
                  )}
                </Box>
                <TextField
                  margin="dense"
                  name="customerName"
                  label="Customer Name"
                  type="text"
                  fullWidth
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
                {productType === 'old' && (
                  <TextField
                    margin="dense"
                    name="customerCnic"
                    label="Customer CNIC"
                    type="text"
                    fullWidth
                    value={formData.customerCnic}
                    onChange={handleChange}
                    required
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button type="submit" form="sell-form" variant="contained" color="primary" disabled={submitting}>
          {submitting ? 'Recording...' : 'Confirm Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSellForm;
