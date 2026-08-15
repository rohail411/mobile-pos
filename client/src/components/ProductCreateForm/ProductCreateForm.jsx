import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from '../../utils/axios';
import { useSnackbar } from 'react-simple-snackbar';

const ProductCreateForm = ({ open, handleClose, productType = 'new', mode = 'add', data = {} }) => {
  const [openSnackbar] = useSnackbar();
  const [formData, setFormData] = useState({
    brand: '',
    price: '',
    model: '',
    imei: '',
    supplierId: '',
  });
  const [errors, setErrors] = useState({});

  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchBrands();
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === 'edit') {
      setFormData({
        brand: data.brandId?.id || '',
        model: data.model || '',
        price: data.price || '',
        imei: data.imei || '',
        supplierId: data.supplierId?.id || '',
      });
    }
  }, [data, mode]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/v1/supplier/getAllSuppliers');
      const updatedSuppliers = (response.data || []).map((supplier) => ({
        label: supplier.name,
        value: supplier.id,
      }));
      setSuppliers(updatedSuppliers);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load suppliers');
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/v1/brand/getAllBrands');
      const updatedBrands = (response.data || []).map((brand) => ({
        label: brand.name,
        value: brand.id,
      }));
      setBrands(updatedBrands);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load brands');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (productType === 'new' && !formData.supplierId) newErrors.supplierId = 'Supplier is required';
    if (!formData.model || !formData.model.trim()) newErrors.model = 'Model is required';
    const priceNum = Number(formData.price);
    if (!formData.price || Number.isNaN(priceNum) || priceNum <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.imei || !formData.imei.trim()) newErrors.imei = 'IMEI is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      let url = '/api/v1/products';
      if (mode === 'edit') {
        url = `/api/v1/products/${data.id}`;
      }
      const response = await axios[mode === 'add' ? 'post' : 'put'](url, { ...formData, type: productType });
      openSnackbar(response.data.message);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to save mobile');
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{mode === 'add' ? 'Add Mobile' : 'Edit Mobile'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            margin="dense"
            name="brand"
            label="Brand"
            fullWidth
            value={formData.brand}
            onChange={handleChange}
            required
            error={Boolean(errors.brand)}
            helperText={errors.brand}
          >
            {brands.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
         {productType==='new' && <TextField
            select
            margin="dense"
            name="supplierId"
            label="Supplier"
            fullWidth
            value={formData.supplierId}
            onChange={handleChange}
            required
            error={Boolean(errors.supplierId)}
            helperText={errors.supplierId}
          >
            {suppliers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> }
          <TextField
            margin="dense"
            name="model"
            label="Model"
            type="text"
            fullWidth
            value={formData.model}
            onChange={handleChange}
            required
            error={Boolean(errors.model)}
            helperText={errors.model}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
            required
            error={Boolean(errors.price)}
            helperText={errors.price}
          />
          <TextField
            margin="dense"
            name="imei"
            label="IMEI Number"
            type="text"
            fullWidth
            value={formData.imei}
            onChange={handleChange}
            required
            error={Boolean(errors.imei)}
            helperText={errors.imei}
          />

          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateForm;
