import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';

const CustomDialog = ({open, handleClose, title, children}) => {
    

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            {children}
        </Dialog>
    );
};

export default CustomDialog;