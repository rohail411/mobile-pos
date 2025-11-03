import { Grid } from '@mui/material';
import OrdersTable from 'components/OrdersTable/OrdersTable';
import React from 'react';

const Orders = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} >
                <OrdersTable/>
            </Grid>
        </Grid>
    );
}

export default Orders;