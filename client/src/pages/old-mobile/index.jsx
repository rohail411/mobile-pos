import { Grid, Typography, Box } from '@mui/material';
import DataTable from 'components/DataTable/DataTable';
import React from 'react';

const OldMobile = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Box>
                    <Typography variant="h5">Old Mobiles</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Inventory of used/second-hand phones available for sale
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <DataTable productType='old'/>
            </Grid>
        </Grid>
    );
}

export default OldMobile;
