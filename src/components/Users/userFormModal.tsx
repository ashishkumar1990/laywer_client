// components/UserFormModal.tsx
import React, { useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Slide, IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import userApi from '../../utils/api/user';
import { getGlobalToast } from '../../context/ToastContext';

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode: 'create' | 'edit';
    initialData?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
                                                         open,
                                                         onClose,
                                                         onSuccess,
                                                         mode,
                                                         initialData
                                                     }) => {
    const toast = getGlobalToast();

    const formik = useFormik({
        initialValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            password: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: mode === 'create'
                ? Yup.string().min(6, 'Minimum 6 characters').required('Password is required')
                : Yup.string(), // optional on edit
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                if (mode === 'edit' && initialData) {
                    await userApi.update(initialData.id, {
                        name: values.name,
                        email: values.email,
                    });
                    toast?.showToast('User updated successfully!', 'success');
                } else {
                    await userApi.create(values);
                    toast?.showToast('User created successfully!', 'success');
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
                {mode === 'edit' ? 'Edit User' : 'Add New User'}
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
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        margin="normal"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    {mode === 'create' && (
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            margin="normal"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    )}
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

export default UserFormModal;
