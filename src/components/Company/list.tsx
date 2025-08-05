import React, {useEffect, useState} from "react";
import companyApi from "../../utils/api/company";
import {
    Box,
    Button,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {motion} from "framer-motion";
import {AddCircle, Delete, Edit} from "@mui/icons-material";
import dayjs from "dayjs";
import {getGlobalToast} from "../../context/ToastContext";
import CompanyFormModal from "./companyFormModal";

export interface Company {
    id: string;
    name: string;
    code: string;
    type: string;
    authorisedPersonName: string;
    email: string;
    phoneNumber: string;
    registeredAddress: string;
    regionalAddress: string;
    created_at: string;
}

const CompanyList: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [backgroundLoading, setBackgroundLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editCompany, setEditCompany] = useState<Company | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; companyId: string | null }>({
        open: false,
        companyId: null,
    });

    const fetchCompanies = async (isBackground = false) => {
        if (isBackground) {
            setBackgroundLoading(true);
        } else {
            setInitialLoading(true);
        }

        try {
            const data = await companyApi.list();
            setCompanies(data);
        } finally {
            if (isBackground) {
                setBackgroundLoading(false);
            } else {
                setInitialLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEdit = (company: Company) => {
        setEditCompany(company);
        setOpenModal(true);
    };

    const handleDelete = async (companyId: string) => {
        setConfirmDelete({ open: true, companyId });
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setEditCompany(null);
    };

    const handleModalSuccess = () => {
        fetchCompanies(true); // background refresh
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
                        Companies
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircle />}
                        onClick={() => {
                            setEditCompany(null);
                            setOpenModal(true);
                        }}
                        sx={{
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2
                        }}
                    >
                        Add Company
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
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Code</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Created At</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map((company: Company) => (
                                <TableRow
                                    key={company.id}
                                    sx={{
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell>{company.code}</TableCell>
                                    <TableCell>{dayjs(company.created_at).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => handleEdit(company)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => handleDelete(company.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {companies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No companies found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <CompanyFormModal
                open={openModal}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                mode={editCompany ? 'edit' : 'create'}
                initialData={editCompany}
            />

            <Dialog
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, companyId: null })}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDelete({ open: false, companyId: null })}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async () => {
                            if (confirmDelete.companyId) {
                                await companyApi.delete(confirmDelete.companyId);
                                setConfirmDelete({ open: false, companyId: null });
                                const toast = getGlobalToast();
                                toast?.showToast('User deleted successfully', 'success');
                                await fetchCompanies(true); // background refresh
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

export default CompanyList;
