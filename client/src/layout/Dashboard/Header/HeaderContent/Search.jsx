import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import MobileOutlined from '@ant-design/icons/MobileOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

import axios from 'utils/axios';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ctrl+K / Cmd+K focuses the search box
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = inputValue.trim();
    if (query.length < 2) {
      setOptions([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          axios.get('/api/v1/products', { params: { search: query, pageSize: 5 } }),
          axios.get('/api/v1/customers', { params: { search: query } })
        ]);
        const products = (productsRes.data.products || []).slice(0, 5).map((p) => ({
          group: 'Mobiles',
          kind: 'product',
          id: `product-${p.id}`,
          label: `${p.brandId?.name || ''} ${p.model || ''}`.trim(),
          secondary: p.imei,
          type: p.type,
          raw: p
        }));
        const customers = (customersRes.data.customers || []).slice(0, 5).map((c) => ({
          group: 'Customers',
          kind: 'customer',
          id: `customer-${c.id}`,
          label: c.name,
          secondary: c.phone,
          raw: c
        }));
        setOptions([...products, ...customers]);
      } catch (error) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const goToDefault = (query) => {
    if (!query) return;
    navigate(`/new-mobiles?search=${encodeURIComponent(query)}`);
  };

  const handleSelect = (option) => {
    if (!option) return;
    if (typeof option === 'string') {
      goToDefault(option);
      return;
    }
    if (option.kind === 'product') {
      const destination = option.type === 'old' ? '/old-mobiles' : '/new-mobiles';
      const query = option.raw.model || option.raw.brandId?.name || '';
      navigate(`${destination}?search=${encodeURIComponent(query)}`);
    } else if (option.kind === 'customer') {
      navigate(`/customers?search=${encodeURIComponent(option.raw.phone || option.raw.name || '')}`);
    }
  };

  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 280 } }}>
        <Autocomplete
          freeSolo
          filterOptions={(x) => x}
          options={options}
          loading={loading}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          inputValue={inputValue}
          onInputChange={(event, newValue, reason) => {
            if (reason === 'input') setInputValue(newValue);
          }}
          onChange={(event, value) => {
            if (value) handleSelect(value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // If an option is already highlighted, Autocomplete's onChange
              // will handle it; otherwise fall back to a default search.
              const hasMatchingOption = options.some(
                (o) => o.label.toLowerCase() === inputValue.trim().toLowerCase()
              );
              if (!hasMatchingOption) {
                goToDefault(inputValue.trim());
              }
            }
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.id}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                {option.kind === 'product' ? <MobileOutlined /> : <UserOutlined />}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {option.label}
                  </Typography>
                  {option.secondary && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {option.secondary}
                    </Typography>
                  )}
                </Box>
                {option.kind === 'product' && (
                  <Chip
                    size="small"
                    label={option.type === 'old' ? 'Old' : 'New'}
                    color={option.type === 'old' ? 'warning' : 'success'}
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          )}
          renderGroup={(params) => (
            <li key={params.key}>
              <ListSubheader component="div">{params.group}</ListSubheader>
              {params.children}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={inputRef}
              size="small"
              id="header-search"
              placeholder="Ctrl + K"
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: -0.5 }}>
                    <SearchOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
              inputProps={{ ...params.inputProps, 'aria-label': 'search' }}
            />
          )}
        />
      </FormControl>
    </Box>
  );
}
