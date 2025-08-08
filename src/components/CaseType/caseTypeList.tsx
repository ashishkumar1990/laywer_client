import React, {useEffect, useState} from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Tooltip, Typography, CircularProgress, Box,
    Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {Edit, Delete, AddCircle} from '@mui/icons-material';
import dayjs from 'dayjs';
import {motion} from 'framer-motion';
import CaseTypeFormModal from './caseTypeFormModal';
import {getGlobalToast} from '../../context/ToastContext';
import caseTypeApi from '../../utils/api/caseType';
import {useDocumentTitle} from "../../hooks/useDocumentTitle";

export interface CaseType {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

const CaseTypeList: React.FC = () => {
    useDocumentTitle('Case Type');
    const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [backgroundLoading, setBackgroundLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editCaseType, setEditCaseType] = useState<CaseType | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; caseTypeId: string | null }>({
        open: false,
        caseTypeId: null,
    });

    const fetchCaseTypes = async (isBackground = false) => {
        if (isBackground) {
            setBackgroundLoading(true);
        } else {
            setInitialLoading(true);
        }

        try {
            const data = await caseTypeApi.list();
            setCaseTypes(data);
        } finally {
            if (isBackground) {
                setBackgroundLoading(false);
            } else {
                setInitialLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchCaseTypes();
    }, []);

    const handleEdit = (caseType: CaseType) => {
        setEditCaseType(caseType);
        setOpenModal(true);
    };

    const handleDelete = async (caseTypeId: string) => {
        setConfirmDelete({open: true, caseTypeId});
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setEditCaseType(null);
    };

    const handleModalSuccess = () => {
        fetchCaseTypes(true); // background refresh
    };

    if (initialLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
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
                        startIcon={<AddCircle/>}
                        onClick={() => {
                            setEditCaseType(null);
                            setOpenModal(true);
                        }}
                        sx={{
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2
                        }}
                    >
                        Add Case Type
                    </Button>
                </Box>

                {backgroundLoading && (
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                            Refreshing...
                        </Typography>
                    </Box>
                )}

                <TableContainer component={Paper} sx={{borderRadius: 2}}>
                    <Table>
                        <TableHead sx={{background: '#3949ab'}}>
                            <TableRow>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Name</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Description</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Created At</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {caseTypes.map((caseType: CaseType) => (
                                <TableRow
                                    key={caseType.id}
                                    sx={{
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    <TableCell>{caseType.name}</TableCell>
                                    <TableCell>{caseType.description}</TableCell>
                                    <TableCell>{dayjs(caseType.created_at).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => handleEdit(caseType)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => handleDelete(caseType.id)}>
                                                <Delete/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {caseTypes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No Case Type found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <CaseTypeFormModal
                open={openModal}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                mode={editCaseType ? 'edit' : 'create'}
                initialData={editCaseType}
            />

            <Dialog
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({open: false, caseTypeId: null})}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this Case Type?</DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDelete({open: false, caseTypeId: null})}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async () => {
                            if (confirmDelete.caseTypeId) {
                                await caseTypeApi.delete(confirmDelete.caseTypeId);
                                setConfirmDelete({open: false, caseTypeId: null});
                                const toast = getGlobalToast();
                                toast?.showToast('Case Type deleted successfully', 'success');
                                await fetchCaseTypes(true); // background refresh
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

export default CaseTypeList;
