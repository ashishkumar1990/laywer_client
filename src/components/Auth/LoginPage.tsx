import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar, Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import authApi from "../../utils/api/auth";
interface FormState {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const [form, setForm] = useState<FormState>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: FormErrors = {};
        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Minimum 6 characters';
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
            await authApi.login(form);
            navigate('/dashboard');
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
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography variant="h5" sx={{ mb: 3 }}>
                                Client Login
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
                                Login
                            </Button>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                Don’t have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    underline="hover"
                                    sx={{
                                        color: '#D4AF37',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            color: '#b9982f',
                                        },
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    Register here
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </motion.div>
        </Box>
    );
}
