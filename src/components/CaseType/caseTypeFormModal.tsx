import React, { useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Slide, IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { getGlobalToast } from '../../context/ToastContext';
import {CaseType} from "./caseTypeList";
import caseTypeApi from "../../utils/api/caseType";

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode: 'create' | 'edit';
    initialData?: CaseType | null;
}

const CaseTypeFormModal: React.FC<UserFormModalProps> = ({
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
            description: initialData?.description || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            description: Yup.string(),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                if (mode === 'edit' && initialData) {
                    await caseTypeApi.update(initialData.id, {
                        name: values.name,
                        email: values.description,
                    });
                    toast?.showToast('Case Type updated successfully!', 'success');
                } else {
                    await caseTypeApi.create(values);
                    toast?.showToast('Case Type created successfully!', 'success');
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
                {mode === 'edit' ? 'Edit Case Type' : 'Add New Case Type'}
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
                        label="Description"
                        name="description"
                        type="description"
                        margin="normal"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
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

export default CaseTypeFormModal;
