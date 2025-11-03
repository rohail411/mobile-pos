import React from 'react'
import { Grid } from '@mui/material';
import SupplierDataTable from 'components/SupplierDataTable/SupplierDataTable';
// import BrandDataTable from 'components/BrandDataTable/BrandDataTable';
// import BrandCreateForm from 'components/BrandCreateForm/BrandCreateForm';


const Supplier = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} >
                <SupplierDataTable/>

            </Grid>
        </Grid>
  )
}

export default Supplier;