import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Link
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import authApi from '../utils/api/auth';

interface RegisterForm {
    email: string;
    name: string;
    password: string;
}

interface RegisterErrors {
    email?: string;
    name?: string;
    password?: string;
}

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterForm>({ email: '', name: '', password: '' });
    const [errors, setErrors] = useState<RegisterErrors>({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: RegisterErrors = {};
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!form.name) {
            newErrors.name = 'Name is required';
        }
        if (!form.password || form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Here you can call an API or save user data
            await authApi.register(form);
            navigate('/');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #2E3B55 40%, #D4AF37 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Paper elevation={12} sx={{ p: 5, maxWidth: 420, width: '100%', borderRadius: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                                <PersonAddIcon />
                            </Avatar>
                            <Typography variant="h5" sx={{ mb: 3 }}>
                                Register
                            </Typography>

                            <TextField
                                name="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={form.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                name="name"
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={form.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />

                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={form.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                                Register
                            </Button>

                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/" underline="hover">
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </motion.div>
        </Box>
    );
}