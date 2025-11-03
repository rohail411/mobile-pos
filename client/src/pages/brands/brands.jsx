import React from 'react'
import { Grid } from '@mui/material';
import BrandDataTable from 'components/BrandDataTable/BrandDataTable';
import BrandCreateForm from 'components/BrandCreateForm/BrandCreateForm';
const brands = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} >
                <BrandDataTable/>

            </Grid>
        </Grid>
  )
}

export default brands;