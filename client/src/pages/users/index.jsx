import React, { useCallback, useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Toolbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Skeleton,
  Typography,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import { useSnackbar } from 'react-simple-snackbar';
import axios from '../../utils/axios';
import CustomDialog from 'components/Dialog/Dialog';
import decodeJwt from '../../utils/decodeJwt';

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' };

const Users = () => {
  const [openSnackbar] = useSnackbar();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState({ open: false, data: {} });

  const currentUserId = decodeJwt(localStorage.getItem('token'))?.id;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/');
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
    // openSnackbar's identity changes on every render (react-simple-snackbar
    // does not memoize it) — omitting it here avoids an infinite fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openForm && !showDeleteDialog.open) {
      fetchUsers();
    }
  }, [openForm, showDeleteDialog.open, fetchUsers]);

  const handleOpenForm = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await axios.post('/api/v1/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      openSnackbar(`User "${response.data.user?.name || formData.name}" created successfully`);
      setOpenForm(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      if (/email/i.test(message)) {
        setFormErrors((prev) => ({ ...prev, email: message }));
      }
      openSnackbar(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (row) => {
    setShowDeleteDialog({ open: true, data: row });
  };

  const handleConfirmDelete = async () => {
    const id = showDeleteDialog.data.id;
    try {
      const response = await axios.delete(`/api/v1/users/${id}`);
      setShowDeleteDialog({ open: false, data: {} });
      openSnackbar(response.data.message || 'User removed successfully');
    } catch (error) {
      openSnackbar(error.response?.data?.message || 'Failed to delete user');
      setShowDeleteDialog({ open: false, data: {} });
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
          <Box>
            <Typography variant="h5">Users</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage the login accounts that can access this app
            </Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          {showDeleteDialog.open && (
            <CustomDialog title="Delete User" open={showDeleteDialog.open} handleClose={() => setShowDeleteDialog({ open: false, data: {} })}>
              <DialogContent>
                Are you sure you want to delete the user &quot;{showDeleteDialog.data.name}&quot;?
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowDeleteDialog({ open: false, data: {} })} variant="outlined" color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} variant="contained" color="error">
                  Delete
                </Button>
              </DialogActions>
            </CustomDialog>
          )}

          <Dialog open={openForm} onClose={handleCloseForm} maxWidth="xs" fullWidth>
            <DialogTitle>Add User</DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 0.5 }}>
                  <TextField
                    name="name"
                    label="Name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(formErrors.name)}
                    helperText={formErrors.name}
                    required
                  />
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={Boolean(formErrors.email)}
                    helperText={formErrors.email}
                    required
                  />
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    error={Boolean(formErrors.password)}
                    helperText={formErrors.password}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setShowPassword((p) => !p)}>
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={Boolean(formErrors.confirmPassword)}
                    helperText={formErrors.confirmPassword}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setShowConfirmPassword((p) => !p)}>
                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseForm} variant="outlined" color="primary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create User'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="primary" startIcon={<UserAddOutlined />} onClick={handleOpenForm}>
              Add User
            </Button>
          </Toolbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      {Array.from({ length: 5 }).map((__, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!loading && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ py: 4 }}>
                        <TeamOutlined style={{ fontSize: 28, opacity: 0.4 }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                          No users yet
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  data.map((row, i) => {
                    const isSelf = row.id === currentUserId;
                    return (
                      <TableRow key={row.id} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {row.name}
                          {isSelf && (
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              (you)
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title={isSelf ? "You can't delete your own account" : 'Delete'}>
                              <span>
                                <IconButton size="small" color="error" disabled={isSelf} onClick={() => handleDelete(row)}>
                                  <DeleteOutlined />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Users;
