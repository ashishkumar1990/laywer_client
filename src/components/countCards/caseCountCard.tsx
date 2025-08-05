import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { People } from '@mui/icons-material';
import caseApi from '../../utils/api/caseType';

const CaseCountCard: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        caseApi
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
                    <People sx={{ mr: 1, verticalAlign: 'middle' }} /> Total Case Type
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

export default CaseCountCard;
