import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios from '../../utils/axios';
import { useSnackbar } from 'react-simple-snackbar';

const SupplierCreateForm = ({ open, handleClose, mode = "add", data }) => {
  const [openSnackbar] = useSnackbar();
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Initialize email field
  });

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData({
        name: data.name,
        email: data.email,
      });
    } else {
      setFormData({ name: '', email: '' }); // Reset form data for 'add' mode
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = '/api/v1/supplier/createSupplier';
      if (mode === 'edit') {
        url = `/api/v1/supplier/updateSupplier/${data._id}`;
      }
      const response = await axios[mode === 'add' ? 'post' : 'put'](url, { ...formData });
      openSnackbar(response.data.message);
    } catch (error) {
      console.error('Error:', error);
      openSnackbar(error.response?.data?.message || 'An error occurred');
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{mode === 'add' ? 'Add Supplier' : 'Edit Supplier'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email" // Change type to 'email' for better validation
            fullWidth
            value={formData.email}
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

export default SupplierCreateForm;
