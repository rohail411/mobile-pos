import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

// ==============================|| MONTHLY BAR CHART - TOP BRANDS ||============================== //

export default function MonthlyBarChart({ categories = [], data = [] }) {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const info = theme.palette.primary.main;

  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: categories.map(() => secondary)
          }
        }
      }
    }));
  }, [info, secondary, categories]);

  if (!categories.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No sales this month yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={[{ name: 'Units Sold', data }]} type="bar" height={365} />
    </Box>
  );
}

MonthlyBarChart.propTypes = {
  categories: PropTypes.array,
  data: PropTypes.array
};
