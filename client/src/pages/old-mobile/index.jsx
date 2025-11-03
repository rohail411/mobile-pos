import { Grid } from '@mui/material';
import DataTable from 'components/DataTable/DataTable';
import React from 'react';

const NewMobile = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} >
                <DataTable productType='old'/>
            </Grid>
        </Grid>
    );
}

export default NewMobile;