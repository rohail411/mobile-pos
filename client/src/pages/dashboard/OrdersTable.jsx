import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

const headCells = [
  { id: 'brand', align: 'left', label: 'Brand / Model' },
  { id: 'type', align: 'left', label: 'Type' },
  { id: 'customer', align: 'left', label: 'Customer' },
  { id: 'sellPrice', align: 'right', label: 'Sell Price' },
  { id: 'date', align: 'right', label: 'Date' }
];

// ==============================|| DASHBOARD - RECENT SALES TABLE ||============================== //

export default function OrderTable({ rows = [] }) {
  if (!rows.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No sales recorded yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align={headCell.align}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                <TableCell>
                  <Stack>
                    <Typography variant="subtitle2">{row.brand}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.model}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={row.type} color={row.type === 'new' ? 'success' : 'warning'} />
                </TableCell>
                <TableCell>{row.customer?.name || '-'}</TableCell>
                <TableCell align="right">${row.sellPrice}</TableCell>
                <TableCell align="right">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTable.propTypes = { rows: PropTypes.array };
