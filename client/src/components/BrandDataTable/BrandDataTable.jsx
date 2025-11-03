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
  Typography,
  DialogContent,
  DialogActions
} from '@mui/material';
import ProductCreateForm from 'components/ProductCreateForm/ProductCreateForm';
import PropTypes from 'prop-types';
import CustomDialog from 'components/Dialog/Dialog';
import ProductSellForm from 'components/ProductSellForm/ProductSellForm';
import { useSnackbar } from 'react-simple-snackbar'
import axios from '../../utils/axios';
import BrandCreateForm from 'components/BrandCreateForm/BrandCreateForm';

const BrandDataTable = ({productType = 'new'}) => {
  const [openSnackbar] = useSnackbar()
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openProductForm, setOpenProductForm] = useState({open: false, mode: 'add', data: {}});
  const [showPriceDialog, setShowPriceDialog] = useState({open: false, price: 0});
  const [showProductSellForm, setShowProductSellForm] = useState({open: false, data: {}});
  const [showDeleteDialog, setShowDeleteDialog] = useState({open: false, data: {}});

  useEffect(() => {
    if(!openProductForm.open && !showDeleteDialog.open && !showProductSellForm.open) {
      getProducts();
    }
  }, [openProductForm.open, showDeleteDialog.open, showProductSellForm.open]);

  const getProducts = async () => {
    try {
      console.log('Product Type:', productType);
      const response = await axios.get('/api/v1/brand/getAllBrands', {params: {type: productType}});
      console.log('Products:', response.data);
      setData(response.data);
    } catch (error) {
      console.log('Error:', error);
      openSnackbar(error.response.data.message);
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (row) => {
    setOpenProductForm({open: true, mode: 'edit', data: row});
  };

  const handleDelete = (row) => {
    setShowDeleteDialog({open: true, data: row});
  };

  const handleConfirmDelete = async () => {
    const id = showDeleteDialog.data._id;
    try {
      const response = await axios.delete(`/api/v1/brand/deleteBrand/${id}`);
      setData(data.filter((item) => item.id !== showDeleteDialog.data.id));
      setShowDeleteDialog({open: false, data: {}});
      openSnackbar(response.data.message);
    } catch (error) {
      console.log('Error:', error);  
      openSnackbar(error.response.data.message);   
    }
 
  }

  return (
    <Paper>
      {showDeleteDialog.open && (<CustomDialog title="Delete Brand" open={showDeleteDialog.open} handleClose={()=> setShowDeleteDialog({open: false, data: {}})}>
      <DialogContent>
          Are you sure you want to delete "{showDeleteDialog.data.name}" it?
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShowDeleteDialog({open: false, data: {}})} variant='outlined' color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='outlined' color="error">
            Delete
          </Button>
        </DialogActions>
      </CustomDialog>)}
      {showProductSellForm.open && (<ProductSellForm productType={productType} open={showProductSellForm.open} handleClose={()=> setShowProductSellForm({open: false, data: {}})} data={showProductSellForm.data} />)}
      {
        showPriceDialog.open && (<CustomDialog title="Mobile Purchase Price" open={showPriceDialog.open} handleClose={()=> setShowPriceDialog({open: false, price:0})}>
          <DialogContent>
            <Typography variant="h6" component="div">
              Price is: {showPriceDialog.price}
            </Typography>
          </DialogContent>
        </CustomDialog>)
      }
      {openProductForm.open && <BrandCreateForm open={openProductForm.open} mode={openProductForm.mode} data={openProductForm.data} handleClose={()=> setOpenProductForm({open: false, mode: 'add', data: {}})} />}
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search by brand"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={()=>setOpenProductForm({open: true, mode:'add', data: {}})}>Add Brand</Button>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Sku</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i+1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(row)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(row)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};



export default BrandDataTable;
