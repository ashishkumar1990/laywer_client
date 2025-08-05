import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import {CorporateFare} from '@mui/icons-material';
import companyApi from '../../utils/api/company';

const CompanyCountCard: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        companyApi
            .getCount()
            .then((res) => setCount(res))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Card
            sx={{
                minWidth: 275,
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    <CorporateFare sx={{ mr: 1, verticalAlign: 'middle' }} /> Total Companies
                </Typography>
                {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                    <Typography variant="h3">{count}</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default CompanyCountCard;
