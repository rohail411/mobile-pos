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
import { useSnackbar } from 'react-simple-snackbar';
import axios from '../../utils/axios';

const DataTable = ({ productType = 'new' }) => {
  const [openSnackbar] = useSnackbar();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openProductForm, setOpenProductForm] = useState({ open: false, mode: 'add', data: {} });
  const [showPriceDialog, setShowPriceDialog] = useState({ open: false, price: 0 });
  const [showProductSellForm, setShowProductSellForm] = useState({ open: false, data: {} });
  const [showDeleteDialog, setShowDeleteDialog] = useState({ open: false, data: {} });

  useEffect(() => {
    if (!openProductForm.open && !showDeleteDialog.open && !showProductSellForm.open) {
      getProducts();
    }
  }, [openProductForm.open, showDeleteDialog.open, showProductSellForm.open]);

  const getProducts = async () => {
    try {
      console.log('Product Type:', productType);
      const response = await axios.get('/api/v1/products', { params: { type: productType } });
      console.log('Products:', response.data.products);

      setData(response.data.products);
    } catch (error) {
      console.log('Error:', error);
      openSnackbar(error.response.data.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    row.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (row) => {
    setOpenProductForm({ open: true, mode: 'edit', data: row });
  };

  const handleDelete = (row) => {
    setShowDeleteDialog({ open: true, data: row });
  };

  const showPrice = (price) => {
    setShowPriceDialog({ open: true, price });
  };

  const handleSell = (row) => {
    setShowProductSellForm({ open: true, data: row });
  };

  const handleConfirmDelete = async () => {
    const id = showDeleteDialog.data._id;
    try {
      const response = await axios.delete(`/api/v1/products/${id}`);
      setData(data.filter((item) => item._id !== showDeleteDialog.data._id));
      setShowDeleteDialog({ open: false, data: {} });
      openSnackbar(response.data.message);
    } catch (error) {
      console.log('Error:', error);
      openSnackbar(error.response.data.message);
    }
  };

  return (
    <Paper>
      {showDeleteDialog.open && (
        <CustomDialog title="Delete Mobile" open={showDeleteDialog.open} handleClose={() => setShowDeleteDialog({ open: false, data: {} })}>
          <DialogContent>
            Are you sure you want to delete "{showDeleteDialog.data.model}" item?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog({ open: false, data: {} })} variant='outlined' color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant='outlined' color="error">
              Delete
            </Button>
          </DialogActions>
        </CustomDialog>
      )}
      {showProductSellForm.open && (
        <ProductSellForm productType={productType} open={showProductSellForm.open} handleClose={() => setShowProductSellForm({ open: false, data: {} })} data={showProductSellForm.data} />
      )}
      {
        showPriceDialog.open && (
          <CustomDialog title="Mobile Purchase Price" open={showPriceDialog.open} handleClose={() => setShowPriceDialog({ open: false, price: 0 })}>
            <DialogContent>
              <Typography variant="h6" component="div">
                Price is: {showPriceDialog.price}
              </Typography>
            </DialogContent>
          </CustomDialog>
        )
      }
      {openProductForm.open && 
        <ProductCreateForm productType={productType} open={openProductForm.open} mode={openProductForm.mode} data={openProductForm.data} handleClose={() => setOpenProductForm({ open: false, mode: 'add', data: {} })} />
      }
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Title or other content can go here */}
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search by model"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpenProductForm({ open: true, mode: 'add', data: {} })}>Add Mobile</Button>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>IMEI Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer CNIC</TableCell>
             {productType==='new' && <TableCell>Supplier Name</TableCell> }
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{row.brandId?.name}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell style={{ cursor: 'pointer' }} onClick={() => showPrice(row.price)}>*******</TableCell>
                <TableCell>{row.imei}</TableCell> {/* Display IMEI number */}
                <TableCell>{row.customerName}</TableCell> 
                <TableCell>{row.customerCnic}</TableCell> 
                {productType==='new' &&<TableCell>{row.supplierId?.name}</TableCell>} {/* Display Supplier Name */}
                <TableCell>
                  <Button onClick={() => handleSell(row)} variant="outlined" color="success" sx={{ marginRight: 1 }}>
                    Sell
                  </Button>
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

DataTable.propTypes = {
  productType: PropTypes.string,
};

export default DataTable;
