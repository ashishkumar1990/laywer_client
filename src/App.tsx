import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from "./components/RegisterPage";
import ApiInterceptor from "./utils/api-interceptor";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import List from "./components/Users/list";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <ApiInterceptor/>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <DashboardLayout>
                            <List />
                        </DashboardLayout>
                    }
                />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
