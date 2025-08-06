import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { People } from '@mui/icons-material';
import workTrackerApi from '../../utils/api/workTracker';

const WorkTrackerCountCard: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workTrackerApi
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
                    <People sx={{ mr: 1, verticalAlign: 'middle' }} /> Total Work Tracker
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

export default WorkTrackerCountCard;
