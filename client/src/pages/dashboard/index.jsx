import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import OrdersTable from './OrdersTable';
import axios from 'utils/axios';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState([]);
  const [orderStats, setOrderStats] = useState({
    week: { count: 0, revenue: 0, profit: 0 },
    month: { count: 0, revenue: 0, profit: 0 },
    topBrands: [],
    recent: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/v1/products/stats'),
        axios.get('/api/v1/orders/stats')
      ]);
      setProductStats(productsRes.data.stats || productsRes.data || []);
      setOrderStats(ordersRes.data || {});
    } catch (error) {
      // stats fail silently, cards fall back to zeroed defaults
    } finally {
      setLoading(false);
    }
  };

  const phonesInStock = productStats.reduce((sum, s) => sum + (s.count || 0), 0);
  const inventoryValue = productStats.reduce((sum, s) => sum + (s.value || 0), 0);
  const week = orderStats.week || { count: 0, revenue: 0, profit: 0 };
  const month = orderStats.month || { count: 0, revenue: 0, profit: 0 };
  const topBrands = orderStats.topBrands || [];
  const recent = orderStats.recent || [];

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Phones in Stock" count={loading ? '-' : String(phonesInStock)} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Inventory Value" count={loading ? '-' : currencyFormatter.format(inventoryValue)} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Sales this Week" count={loading ? '-' : `${week.count} (${currencyFormatter.format(week.revenue)})`} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Sales this Month" count={loading ? '-' : `${month.count} (${currencyFormatter.format(month.revenue)})`} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce title="Profit this Month" count={loading ? '-' : currencyFormatter.format(month.profit)} color="success" />
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Top Brands This Month</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                Best-selling brands, last 30 days
              </Typography>
            </Stack>
          </Box>
          <MonthlyBarChart categories={topBrands.map((b) => b.brand)} data={topBrands.map((b) => b.count)} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">This Month</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Units Sold</Typography>
              <Typography variant="subtitle1">{month.count}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Revenue</Typography>
              <Typography variant="subtitle1">{currencyFormatter.format(month.revenue)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Profit</Typography>
              <Typography variant="subtitle1" color="success.main">{currencyFormatter.format(month.profit)}</Typography>
            </Stack>
          </Stack>
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Sales</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable rows={recent} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
