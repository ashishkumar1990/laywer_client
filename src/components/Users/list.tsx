import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Tooltip, Typography, CircularProgress, Box,
    Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit, Delete, AddCircle } from '@mui/icons-material';
import userApi from '../../utils/api/user';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import UserFormModal from './userFormModal';
import { getGlobalToast } from '../../context/ToastContext';

interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

const List: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [backgroundLoading, setBackgroundLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; userId: string | null }>({
        open: false,
        userId: null,
    });

    const fetchUsers = async (isBackground = false) => {
        if (isBackground) {
            setBackgroundLoading(true);
        } else {
            setInitialLoading(true);
        }

        try {
            const data = await userApi.list();
            setUsers(data);
        } finally {
            if (isBackground) {
                setBackgroundLoading(false);
            } else {
                setInitialLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        setEditUser(user);
        setOpenModal(true);
    };

    const handleDelete = async (userId: string) => {
        setConfirmDelete({ open: true, userId });
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setEditUser(null);
    };

    const handleModalSuccess = () => {
        fetchUsers(true); // background refresh
    };

    if (initialLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Paper
                sx={{
                    p: 3,
                    background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
                    borderRadius: 3,
                    boxShadow: 4,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight={600}>
                        👥 Users
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircle />}
                        onClick={() => {
                            setEditUser(null);
                            setOpenModal(true);
                        }}
                        sx={{
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2
                        }}
                    >
                        Add User
                    </Button>
                </Box>

                {backgroundLoading && (
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            Refreshing...
                        </Typography>
                    </Box>
                )}

                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ background: '#3949ab' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Created At</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user: User) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{dayjs(user.created_at).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => handleEdit(user)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <UserFormModal
                open={openModal}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                mode={editUser ? 'edit' : 'create'}
                initialData={editUser}
            />

            <Dialog
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, userId: null })}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDelete({ open: false, userId: null })}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async () => {
                            if (confirmDelete.userId) {
                                await userApi.delete(confirmDelete.userId);
                                setConfirmDelete({ open: false, userId: null });
                                const toast = getGlobalToast();
                                toast?.showToast('User deleted successfully', 'success');
                                await fetchUsers(true); // background refresh
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};

export default List;
