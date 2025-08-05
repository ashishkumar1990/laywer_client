import React, {useEffect} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Slide, IconButton
} from '@mui/material';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import companyApi from '../../utils/api/company';
import {getGlobalToast} from '../../context/ToastContext';
import {Company} from "./list";

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface CompanyFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode: 'create' | 'edit';
    initialData?: Company | null;
}

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
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
            code: initialData?.code || '',
            email: initialData?.email || '',
            type: initialData?.type || '',
            authorisedPersonName: initialData?.authorisedPersonName || '',
            phoneNumber: initialData?.phoneNumber || '',
            registeredAddress: initialData?.registeredAddress || '',
            regionalAddress: initialData?.regionalAddress || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            code: Yup.string().required('Code is required'),
            email: Yup.string().email('Invalid email'),
            type: Yup.string(),
            authorisedPersonName: Yup.string(),
            phoneNumber: Yup.string()
                .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
            registeredAddress: Yup.string(),
            regionalAddress: Yup.string(),
        }),
        onSubmit: async (values, {resetForm}) => {
            try {
                if (mode === 'edit' && initialData) {
                    await companyApi.update(initialData.id, {
                        id: initialData.id,
                        name: values.name,
                        email: values.email,
                        code: values.code,
                        type: values.type,
                        authorisedPersonName: values.authorisedPersonName,
                        phoneNumber: values.phoneNumber,
                        registeredAddress: values.registeredAddress,
                        regionalAddress: values.regionalAddress,
                    });
                    toast?.showToast('Company updated successfully!', 'success');
                } else {
                    await companyApi.create([values]);
                    toast?.showToast('Company created successfully!', 'success');
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
                {mode === 'edit' ? 'Edit Company' : 'Add New Company'}
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
                    <CloseIcon/>
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
                        label="Code"
                        name="code"
                        margin="normal"
                        value={formik.values.code}
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
                    <TextField
                        fullWidth
                        label="Type"
                        name="type"
                        margin="normal"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        helperText={formik.touched.type && formik.errors.type}
                    />
                    <TextField
                        fullWidth
                        label="Authorised Person Name"
                        name="authorisedPersonName"
                        margin="normal"
                        value={formik.values.authorisedPersonName}
                        onChange={formik.handleChange}
                        error={formik.touched.authorisedPersonName && Boolean(formik.errors.authorisedPersonName)}
                        helperText={formik.touched.authorisedPersonName && formik.errors.authorisedPersonName}
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        margin="normal"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        inputProps={{maxLength: 10}}
                        onKeyPress={(e) => {
                            if (!/^\d$/.test(e.key)) {
                                e.preventDefault(); // only allow digits
                            }
                        }}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />
                    <TextField
                        fullWidth
                        label="Registered Address"
                        name="registeredAddress"
                        multiline
                        rows={4}
                        margin="normal"
                        value={formik.values.registeredAddress}
                        onChange={formik.handleChange}
                        error={formik.touched.registeredAddress && Boolean(formik.errors.registeredAddress)}
                        helperText={formik.touched.registeredAddress && formik.errors.registeredAddress}
                    />
                    <TextField
                        fullWidth
                        label="Regional Address"
                        name="regionalAddress"
                        multiline
                        rows={4}
                        margin="normal"
                        value={formik.values.regionalAddress}
                        onChange={formik.handleChange}
                        error={formik.touched.regionalAddress && Boolean(formik.errors.regionalAddress)}
                        helperText={formik.touched.regionalAddress && formik.errors.regionalAddress}
                    />
                    {/*{mode === 'create' && (*/}
                    {/*    <TextField*/}
                    {/*        fullWidth*/}
                    {/*        label="Password"*/}
                    {/*        name="password"*/}
                    {/*        type="password"*/}
                    {/*        margin="normal"*/}
                    {/*        value={formik.values.password}*/}
                    {/*        onChange={formik.handleChange}*/}
                    {/*        error={formik.touched.password && Boolean(formik.errors.password)}*/}
                    {/*        helperText={formik.touched.password && formik.errors.password}*/}
                    {/*    />*/}
                    {/*)}*/}
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

export default CompanyFormModal;
