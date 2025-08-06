import React from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    IconButton
} from '@mui/material';
import {Settings, Dashboard, SupervisedUserCircleRounded, CorporateFare} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Company', icon: <CorporateFare />, path: '/company' },
        { text: 'Users', icon: <SupervisedUserCircleRounded />, path: '/users' },
        { text: 'CaseType', icon: <SupervisedUserCircleRounded />, path: '/cases' },
        { text: 'Work tracker', icon: <SupervisedUserCircleRounded />, path: '/workTracker' },
        { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    const drawer = (
        <List>
            {drawerItems.map(({ text, icon, path }) => (
                <ListItem button key={text} onClick={() => navigate(path)}>
                    <ListItemIcon sx={{ color: '#ffffffcc' }}>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* AppBar with vibrant gradient */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                    color: '#fff',
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Lawyer Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        background: 'linear-gradient(to bottom, #232526, #414345)',
                        color: '#fff',
                    },
                }}
            >
                <Toolbar />
                {drawer}
            </Drawer>

            {/* Page Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
                    minHeight: '100vh',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
