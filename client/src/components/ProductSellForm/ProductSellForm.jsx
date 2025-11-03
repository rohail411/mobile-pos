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
import { useSnackbar } from 'react-simple-snackbar'

const ProductSellForm = ({open, handleClose, productType, data}) => {
  const [openSnackbar] = useSnackbar()
  const [formData, setFormData] = useState({
    brand: '',
    price: '',
    model: '',
    quantity: '',
    customerName: '',
    customerPhone: '', 
    customerCnic: '',
    imei: '',
  });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    setFormData({
        ...formData,
      brand: data.brandId.name,
      model: data.model,
      quantity: 1,
      imei: data.imei, 
    })
  }, [data]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/v1/brand/getAllBrands');
      console.log('Brands:', response.data);
      const updatedBrands = response.data.map((brand) => ({
        label: brand.name,
        value: brand.name,
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
    try {
        const response = await axios.post('/api/v1/orders', {...formData, type: productType, productId: data._id, price: data.price, sellPrice: formData.price});
        openSnackbar(response.data.message);

    } catch (error) {
        openSnackbar(error.response.data.message);
    }
    handleClose();
  };

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sell Mobile</DialogTitle>
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
              InputProps={{readOnly: true}}
            >
              {brands.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="model"
              label="Model"
              type="text"
              fullWidth
              value={formData.model}
              onChange={handleChange}
              required
              InputProps={{readOnly: true}}
            />
         
         

<TextField
              margin="dense"
              name="IMEI Number"
              label="IMEI Number"
              // type="text"
              fullWidth
              value={formData.imei}
              onChange={handleChange}
             readOnly
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
              name="customerName"
              label="Customer Name"
              type="text"
              fullWidth
              value={formData.customerName}
              onChange={handleChange}
              required/>
            <TextField
                margin="dense"
                name="customerPhone"
                label="Customer Phone"
                type="number"
                fullWidth
                value={formData.customerPhone}
                onChange={handleChange}
                required/>
            {productType==='old' &&<TextField
                margin="dense"
                name="customerCnic"
                label="Customer CNIC"
                type="number"
                fullWidth
                value={formData.customerCnic}
                onChange={handleChange}
                required/>}
            <DialogActions>
              <Button onClick={handleClose} variant="outlined" color="error">
                Cancel
              </Button>
              <Button type="submit" variant="outlined" color="primary">
                Sell
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
  );
};

export default ProductSellForm;
