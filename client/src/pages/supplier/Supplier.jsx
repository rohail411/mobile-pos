import React from 'react'
import { Grid, Typography, Box } from '@mui/material';
import SupplierDataTable from 'components/SupplierDataTable/SupplierDataTable';


const Supplier = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Box>
                    <Typography variant="h5">Suppliers</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage the suppliers you purchase new stock from
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <SupplierDataTable/>

            </Grid>
        </Grid>
  )
}

export default Supplier;
