import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Slide, IconButton, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { getGlobalToast } from '../../context/ToastContext';
import {WorkTracker} from "./workTrackerList";
import workTrackerApi from "../../utils/api/workTracker";
import {Company} from "../Company/list";
import {CaseType} from "../CaseType/caseTypeList";
import {User} from "../Users/list"

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode: 'create' | 'edit';
    initialData?: WorkTracker | null;
    companies: Company[] | [];
    cases: CaseType[] | [];
    users: User[] | [];
}
const WorkTrackerFormModal: React.FC<UserFormModalProps> = ({
                                                         open,
                                                         onClose,
                                                         onSuccess,
                                                         mode,
                                                         initialData,
                                                         companies,
                                                         cases,
                                                         users
                                                     }) => {
    const toast = getGlobalToast();


    const formik = useFormik({
        initialValues: {
            entryType: initialData?.entryType || '',
            allocationDate: initialData?.allocationDate || '',
            allocationBy: initialData?.allocationBy || '',
            status: initialData?.status || '',
            companies: initialData?.companies?.id || '',
            cases: initialData?.cases?.id || '',
            users: initialData?.users?.id || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            entryType: Yup.string()
                .oneOf(['BULK', 'INDIVIDUAL'], 'Invalid entry type')
                .required('Entry Type is required'),
            allocationDate: Yup.string().required('Allocation date is required'),
            allocationBy: Yup.string().required('Allocation by is required'),
            status: Yup.string().required('Status is required'),
            companies: Yup.string().required('Company is required'),
            cases: Yup.string().required('Case is required'),
            users: Yup.string().required('User is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                if (mode === 'edit' && initialData) {
                    await workTrackerApi.update(initialData.id, {
                        id: initialData.id,
                        entryType: values.entryType,
                        allocationDate: values.allocationDate,
                        allocationBy: values.allocationBy,
                        status: values.status,
                        companyId: values.companies,
                        caseId: values.cases,
                        userId: values.users,
                    });
                    toast?.showToast('Work Tracker updated successfully!', 'success');
                } else {
                    await workTrackerApi.create({
                        entryType: values.entryType,
                        allocationDate: values.allocationDate,
                        allocationBy: values.allocationBy,
                        status: values.status,
                        companyId: values.companies,
                        caseId: values.cases,
                        userId: values.users,
                    });
                    toast?.showToast('Work Tracker created successfully!', 'success');
                }

                onSuccess();
                resetForm();
                onClose();
            } catch (err: any) {
                toast?.showToast(err.message || 'Something went wrong', 'error');
            }
        },
    });

    return (
        <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth maxWidth="sm">
            <DialogTitle>
                {mode === 'edit' ? 'Edit Work Tracker' : 'Add New Work Tracker'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Entry Type</InputLabel>
                        <Select
                            name="entryType"
                            value={formik.values.entryType}
                            onChange={formik.handleChange}
                            error={formik.touched.entryType && Boolean(formik.errors.entryType)}
                        >
                            <MenuItem value="BULK">BULK</MenuItem>
                            <MenuItem value="INDIVIDUAL">INDIVIDUAL</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Allocation Date"
                        name="allocationDate"
                        type="date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.allocationDate}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.allocationDate && Boolean(formik.errors.allocationDate)
                        }
                        helperText={
                            formik.touched.allocationDate && formik.errors.allocationDate
                        }
                    />

                    <TextField
                        fullWidth
                        label="Allocation By"
                        name="allocationBy"
                        margin="normal"
                        value={formik.values.allocationBy}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.allocationBy && Boolean(formik.errors.allocationBy)
                        }
                        helperText={
                            formik.touched.allocationBy && formik.errors.allocationBy
                        }
                    />

                    <TextField
                        fullWidth
                        label="Status"
                        name="status"
                        margin="normal"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        error={formik.touched.status && Boolean(formik.errors.status)}
                        helperText={formik.touched.status && formik.errors.status}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Company</InputLabel>
                        <Select
                            name="companies"
                            value={formik.values.companies}
                            onChange={formik.handleChange}
                            error={formik.touched.companies && Boolean(formik.errors.companies)}
                        >
                            {companies.map((company: Company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Case</InputLabel>
                        <Select
                            name="cases"
                            value={formik.values.cases}
                            onChange={formik.handleChange}
                            error={formik.touched.cases && Boolean(formik.errors.cases)}
                        >
                            {cases.map((c: CaseType) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>User</InputLabel>
                        <Select
                            name="users"
                            value={formik.values.users}
                            onChange={formik.handleChange}
                            error={formik.touched.users && Boolean(formik.errors.users)}
                        >
                            {users.map((user: User) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={formik.handleReset} color="warning" variant="outlined">
                    Reset
                </Button>
                <Button onClick={formik.handleSubmit as any} color="primary" variant="contained">
                    {mode === 'edit' ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WorkTrackerFormModal;
