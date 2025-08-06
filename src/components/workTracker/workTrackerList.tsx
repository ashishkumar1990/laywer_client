import React, {useEffect, useState} from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Tooltip, Typography, CircularProgress, Box,
    Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {Edit, Delete, AddCircle} from '@mui/icons-material';
import workTrackerApi from './../../utils/api/workTracker';
import dayjs from 'dayjs';
import {motion} from 'framer-motion';
import {getGlobalToast} from '../../context/ToastContext';
import WorkTrackerFormModal from './workTrackerFormModal';
import companyApi from "../../utils/api/company";
import caseApi from "../../utils/api/caseType";
import userApi from "../../utils/api/user";

export interface CreateWorkTracker {
    id: string;
    entryType: string;
    allocationDate: string;
    allocationBy: string;
    status: string;
    companies: string;
    cases: string;
    users: string;
    created_at: string;
}

export interface WorkTracker {
    id: string;
    entryType: string;
    allocationDate: string;
    allocationBy: string;
    status: string;
    companies: {
        id: string;
        name: string;
        code: string;
        type: string;
        authorisedPersonName: string;
        email: string;
        phoneNumber: number;
        registeredAddress: string;
        regionalAddress: string;
    };
    cases: {
        id: string;
        name: string,
        description: string;
        createdAt: string;
    };
    users: {
        id: string;
        name: string;
        email: string;
        phoneNumber: number;
    };
    created_at: string;
}

const WorkTrackerList: React.FC = () => {
    const [workTrackers, setWorkTrackers] = useState<WorkTracker[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [backgroundLoading, setBackgroundLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editWorkTracker, setEditWorkTracker] = useState<WorkTracker | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; workTrackerId: string | null }>({
        open: false,
        workTrackerId: null,
    });
    const [companies, setCompanies] = useState([]);
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const toast = getGlobalToast();

    const fetchWorkTrackers = async (isBackground = false) => {
        if (isBackground) {
            setBackgroundLoading(true);
        } else {
            setInitialLoading(true);
        }

        try {
            const data = await workTrackerApi.list();
            setWorkTrackers(data);
        } finally {
            if (isBackground) {
                setBackgroundLoading(false);
            } else {
                setInitialLoading(false);
            }
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await companyApi.list();
            setCompanies(response);
        } catch (error: any) {
            toast?.showToast(error.message || 'Error fetching companies:', 'error');
        }
    };

    const fetchCases = async () => {
        try {
            const response = await caseApi.list();
            setCases(response);
        } catch (error: any) {
            toast?.showToast(error.message || 'Error fetching cases:', 'error');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userApi.list();
            setUsers(response);
        } catch (error: any) {
            toast?.showToast(error.message || 'Error fetching users:', 'error');
        }
    };

    useEffect(() => {
        fetchWorkTrackers();
        fetchCompanies();
        fetchCases();
        fetchUsers();
    }, []);

    const handleEdit = (workTracker: WorkTracker) => {
        setEditWorkTracker(workTracker);
        setOpenModal(true);
    };

    const handleDelete = async (workTrackerId: string) => {
        setConfirmDelete({open: true, workTrackerId});
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setEditWorkTracker(null);
    };

    const handleModalSuccess = () => {
        fetchWorkTrackers(true); // background refresh
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
                        👥 Work Trackers
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircle/>}
                        onClick={() => {
                            setEditWorkTracker(null);
                            setOpenModal(true);
                        }}
                        sx={{
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2
                        }}
                    >
                        Add Work Tracker
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
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Company Name</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Company code</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Entry Type</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Allocation Date</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Allocation By</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>status</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Assigned To</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}}>Created At</TableCell>
                                <TableCell sx={{color: '#fff', fontWeight: 'bold'}} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workTrackers.map((workTracker: WorkTracker) => (
                                <TableRow
                                    key={workTracker.id}
                                    sx={{
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    <TableCell>{workTracker.companies.name}</TableCell>
                                    <TableCell>{workTracker.companies.code}</TableCell>
                                    <TableCell>{workTracker.entryType}</TableCell>
                                    <TableCell>{dayjs(workTracker.allocationDate).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell>{workTracker.allocationBy}</TableCell>
                                    <TableCell>{workTracker.status}</TableCell>
                                    <TableCell>{workTracker.users.name}</TableCell>
                                    <TableCell>{dayjs(workTracker.created_at).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => handleEdit(workTracker)}>
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => handleDelete(workTracker.id)}>
                                                <Delete/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {workTrackers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No Work Tracker found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <WorkTrackerFormModal
                open={openModal}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                mode={editWorkTracker ? 'edit' : 'create'}
                initialData={editWorkTracker}
                companies={companies}
                cases={cases}
                users={users}
            />

            <Dialog
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({open: false, workTrackerId: null})}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this Work Tracker?</DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDelete({open: false, workTrackerId: null})}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={async () => {
                            if (confirmDelete.workTrackerId) {
                                await workTrackerApi.delete(confirmDelete.workTrackerId);
                                setConfirmDelete({open: false, workTrackerId: null});
                                const toast = getGlobalToast();
                                toast?.showToast('Work Tracker deleted successfully', 'success');
                                await fetchWorkTrackers(true); // background refresh
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

export default WorkTrackerList;
