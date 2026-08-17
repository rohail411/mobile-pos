import React from 'react'
import { Grid, Typography, Box } from '@mui/material';
import BrandDataTable from 'components/BrandDataTable/BrandDataTable';
const brands = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Box>
                    <Typography variant="h5">Brands</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage the phone brands used across your inventory
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} >
                <BrandDataTable/>

            </Grid>
        </Grid>
  )
}

export default brands;
