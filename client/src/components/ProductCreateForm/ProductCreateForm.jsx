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
import { brands } from 'utils/brands';
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

  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (mode === 'edit') {
      setFormData({
        ...formData,
        brand: data.brandId._id,
        model: data.model,
        price: data.price,
        imei: data.imei || '', // Populate IMEI if editing
        supplierId: data.supplierId?._id, 
        customerName:data.name,
        customerCnic:data.cnic,
      });
    }
  }, [data, mode]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/v1/supplier/getAllSuppliers');
      console.log('Suppliers:', response.data);
      const updatedSuppliers = response.data.map((supplier) => ({
        label: supplier.name,
        value: supplier._id,
      }));
      setSuppliers(updatedSuppliers);
    } catch (error) {
      console.log('Error:', error);
      openSnackbar(error.response.data.message);
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/v1/brand/getAllBrands');
      console.log('Brands:', response.data);
      const updatedBrands = response.data.map((brand) => ({
        label: brand.name,
        value: brand._id,
      }));
      setBrands(updatedBrands);
    } catch (error) {
      console.log('Error:', error);
      openSnackbar(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      let url = '/api/v1/products';
      if (mode === 'edit') {
        url = `/api/v1/products/${data._id}`;
      }
      const response = await axios[mode === 'add' ? 'post' : 'put'](url, { ...formData, type: productType });
      console.log('Product created:', response.data);
      openSnackbar(response.data.message);
    } catch (error) {
      console.log('Error: failed to save', error);
      openSnackbar(error.response.data.message);
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
          />

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

          
          
         
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateForm;
