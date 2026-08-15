import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Toolbar,
  Typography,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
  Skeleton,
  Box
} from '@mui/material';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import ProductCreateForm from 'components/ProductCreateForm/ProductCreateForm';
import PropTypes from 'prop-types';
import CustomDialog from 'components/Dialog/Dialog';
import ProductSellForm from 'components/ProductSellForm/ProductSellForm';
import { useSnackbar } from 'react-simple-snackbar';
import axios from '../../utils/axios';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const DataTable = ({ productType = 'new' }) => {
  const [openSnackbar] = useSnackbar();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [brandFilter, setBrandFilter] = useState('');
  const [brandOptions, setBrandOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openProductForm, setOpenProductForm] = useState({ open: false, mode: 'add', data: {} });
  const [showProductSellForm, setShowProductSellForm] = useState({ open: false, data: {} });
  const [showDeleteDialog, setShowDeleteDialog] = useState({ open: false, data: {} });

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Re-applies the URL's ?search= when it changes without the component
  // remounting — e.g. using the header search again while already on this
  // page. DataTable never writes to the URL itself, so this can't loop.
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
    setDebouncedSearch(urlSearch);
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchBrandOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBrandOptions = async () => {
    try {
      const response = await axios.get('/api/v1/brand/getAllBrands');
      setBrandOptions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      // non-fatal, brand filter simply stays empty
    }
  };

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/products', {
        params: {
          type: productType,
          search: debouncedSearch || undefined,
          page: page + 1,
          pageSize
        }
      });
      let products = response.data.products || [];
      if (brandFilter) {
        products = products.filter((p) => p.brandId?.id === brandFilter);
      }
      setData(products);
      setTotal(response.data.total || 0);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load mobiles');
    } finally {
      setLoading(false);
    }
    // openSnackbar's identity changes on every render (react-simple-snackbar
    // does not memoize it) — omitting it here avoids an infinite fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType, debouncedSearch, page, pageSize, brandFilter]);

  useEffect(() => {
    if (!openProductForm.open && !showDeleteDialog.open && !showProductSellForm.open) {
      getProducts();
    }
  }, [openProductForm.open, showDeleteDialog.open, showProductSellForm.open, getProducts]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (row) => {
    setOpenProductForm({ open: true, mode: 'edit', data: row });
  };

  const handleDelete = (row) => {
    setShowDeleteDialog({ open: true, data: row });
  };

  const handleSell = (row) => {
    setShowProductSellForm({ open: true, data: row });
  };

  const handleConfirmDelete = async () => {
    const id = showDeleteDialog.data.id;
    try {
      const response = await axios.delete(`/api/v1/products/${id}`);
      setShowDeleteDialog({ open: false, data: {} });
      openSnackbar(response.data.message);
      getProducts();
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to delete mobile');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columnCount = useMemo(() => (productType === 'new' ? 6 : 5), [productType]);

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
            <Button onClick={handleConfirmDelete} variant='contained' color="error">
              Delete
            </Button>
          </DialogActions>
        </CustomDialog>
      )}
      {showProductSellForm.open && (
        <ProductSellForm productType={productType} open={showProductSellForm.open} handleClose={() => setShowProductSellForm({ open: false, data: {} })} data={showProductSellForm.data} />
      )}
      {openProductForm.open &&
        <ProductCreateForm productType={productType} open={openProductForm.open} mode={openProductForm.mode} data={openProductForm.data} handleClose={() => setOpenProductForm({ open: false, mode: 'add', data: {} })} />
      }
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <TextField
          variant="outlined"
          placeholder="Search by model"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ marginRight: 2, minWidth: 220 }}
        />
        <TextField
          select
          size="small"
          label="Brand"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          sx={{ marginRight: 2, minWidth: 160 }}
        >
          <MenuItem value="">All Brands</MenuItem>
          {brandOptions.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {brand.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={() => setOpenProductForm({ open: true, mode: 'add', data: {} })}>Add Mobile</Button>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>IMEI Number</TableCell>
              {productType === 'new' && <TableCell>Supplier</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  {Array.from({ length: columnCount + 1 }).map((__, cellIdx) => (
                    <TableCell key={cellIdx}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount + 1} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No mobiles in inventory yet
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading && data.map((row, i) => (
              <TableRow key={row.id ?? i} hover>
                <TableCell>{page * pageSize + i + 1}</TableCell>
                <TableCell>{row.brandId?.name}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell>{currencyFormatter.format(row.price || 0)}</TableCell>
                <TableCell>{row.imei}</TableCell>
                {productType === 'new' && <TableCell>{row.supplierId?.name || '-'}</TableCell>}
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Sell">
                      <IconButton size="small" color="success" onClick={() => handleSell(row)}>
                        <ShoppingCartOutlined />
                      </IconButton>
                    </Tooltip>
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
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

DataTable.propTypes = {
  productType: PropTypes.string,
};

export default DataTable;
