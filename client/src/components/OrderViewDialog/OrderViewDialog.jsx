import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const OrderViewDialog = ({ open, onClose, product }) => {
    return (
        <Dialog maxWidth='lg'  open={open} onClose={onClose}>
            <DialogTitle>{product.brand} {product.model}</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Field</strong></TableCell>
                                <TableCell><strong>Value</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Model</TableCell>
                                <TableCell>{product.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell>${product.price}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sell Price</TableCell>
                                <TableCell>${product.sellPrice}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                           
                            <TableRow>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>{product.customer?.name || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Customer Phone</TableCell>
                                <TableCell>{product.customer?.phone || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Customer CNIC</TableCell>
                                <TableCell>{product.customer?.cnic || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Order At</TableCell>
                                <TableCell>{new Date(product.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                           
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderViewDialog;
