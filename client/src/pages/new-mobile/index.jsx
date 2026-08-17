import { Grid, Typography, Box } from '@mui/material';
import DataTable from 'components/DataTable/DataTable';
import React from 'react';

const NewMobile = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Box>
                    <Typography variant="h5">New Mobiles</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Inventory of brand-new phones available for sale
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <DataTable/>
            </Grid>
        </Grid>
    );
}

export default NewMobile;
