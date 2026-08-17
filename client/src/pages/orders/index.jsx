import { Grid, Typography, Box } from '@mui/material';
import OrdersTable from 'components/OrdersTable/OrdersTable';
import React from 'react';

const Orders = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Box>
                    <Typography variant="h5">Sold Mobiles</Typography>
                    <Typography variant="body2" color="text.secondary">
                        History of completed sales, with reporting and customer detail
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <OrdersTable/>
            </Grid>
        </Grid>
    );
}

export default Orders;
