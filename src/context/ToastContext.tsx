import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, SnackbarOrigin, AlertColor } from '@mui/material';

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor, position?: SnackbarOrigin) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalToast: ToastContextType | null = null;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [position, setPosition] = useState<SnackbarOrigin>({ vertical: 'top', horizontal: 'right' });

    const showToast = (
        msg: string,
        sev: AlertColor = 'info',
        pos: SnackbarOrigin = { vertical: 'top', horizontal: 'right' }
    ) => {
        setMessage(msg);
        setSeverity(sev);
        setPosition(pos);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const contextValue: ToastContextType = { showToast };
    globalToast = contextValue;

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={position}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

export const getGlobalToast = () => globalToast;

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
