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
  DialogActions,
  IconButton,
  Tooltip,
  Stack,
  Box
} from '@mui/material';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';
import ProductCreateForm from 'components/ProductCreateForm/ProductCreateForm';
import PropTypes from 'prop-types';
import CustomDialog from 'components/Dialog/Dialog';
import ProductSellForm from 'components/ProductSellForm/ProductSellForm';
import { useSnackbar } from 'react-simple-snackbar'
import axios from '../../utils/axios';
import SupplierCreateForm from 'components/SupplierCreateForm/SupplierCreateForm';

const SupplierDataTable = ({productType = 'new'}) => {
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
      const response = await axios.get('/api/v1/supplier/getAllSuppliers', {params: {type: productType}});
      setData(response.data);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load suppliers');
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
    const id = showDeleteDialog.data.id;
    try {
      const response = await axios.delete(`/api/v1/supplier/deleteSupplier/${id}`);
      setData(data.filter((item) => item.id !== id));
      setShowDeleteDialog({open: false, data: {}});
      openSnackbar(response.data.message);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to delete supplier');
    }
  }

  return (
    <Paper>
      {showDeleteDialog.open && (<CustomDialog title="Delete Supplier" open={showDeleteDialog.open} handleClose={()=> setShowDeleteDialog({open: false, data: {}})}>
      <DialogContent>
          Are you sure you want to delete &quot;{showDeleteDialog.data.name}&quot;?
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShowDeleteDialog({open: false, data: {}})} variant='outlined' color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' color="error">
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
      {openProductForm.open && <SupplierCreateForm open={openProductForm.open} mode={openProductForm.mode} data={openProductForm.data} handleClose={()=> setOpenProductForm({open: false, mode: 'add', data: {}})} />}
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <TextField
          variant="outlined"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ marginRight: 2, minWidth: 220 }}
        />
        <Button variant="contained" color="primary" onClick={()=>setOpenProductForm({open: true, mode:'add', data: {}})}>Add Supplier</Button>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box sx={{ py: 4 }}>
                    <ShopOutlined style={{ fontSize: 28, opacity: 0.4 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      No suppliers yet
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {filteredData.map((row, i) => (
              <TableRow key={row.id ?? i} hover>
                <TableCell>{i+1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};



SupplierDataTable.propTypes = {
  productType: PropTypes.string,
};

export default SupplierDataTable;
