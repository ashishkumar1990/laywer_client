import React from 'react';
import { Box, Typography, Paper,Grid } from '@mui/material';
import { motion } from 'framer-motion';
import UserCountCard from "./UserCountCard";

export default function Dashboard() {
    return (
        <Box sx={{ p: 4 }}>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Welcome to the Dashboard
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <UserCountCard />
                            </Grid>
                            {/* Add more cards here */}
                        </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
}