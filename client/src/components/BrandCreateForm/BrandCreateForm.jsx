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


const BrandCreateForm = ({open, handleClose, mode="add", data}) => {
  const [openSnackbar] = useSnackbar()
  const [formData, setFormData] = useState({
    name: '',
   
  });

  

 
  

  useEffect(()=> {
    if(mode === 'edit') {
      setFormData({
        ...formData,
        name: data.name,
      
      });
    }
  }, [mode,data]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
        let url = '/api/v1/brand/createBrand';
        if(mode === 'edit') {
            url = `/api/v1/brand/updateBrand/${data._id}`;
        }
        // axios.post()
        // axios['post']()
        const response = await axios[mode==='add'? 'post': 'put'](url, {...formData });
        console.log('brand created:', response.data);
        openSnackbar(response.data.message);
    } catch (error) {
        console.log('Error:', error);
        openSnackbar(error.response.data.message);
    }
    handleClose();
  };

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{mode==='add' ? 'Add Brand': 'Edit Brand'}</DialogTitle>
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


export default BrandCreateForm;
