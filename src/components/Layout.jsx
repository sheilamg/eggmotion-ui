import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAuthGuard } from '../hooks/useAuthGuard';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsightsIcon from '@mui/icons-material/Insights';

const drawerWidth = 240;

const Layout = () => {
  const { user, logout } = useAuth();
  const { loading } = useAuthGuard();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const navItems = [
    { to: '/home', label: 'Home', icon: <HomeIcon /> },
    { to: '/emotions', label: 'Emotions', icon: <EmojiEmotionsIcon /> },
    { to: '/history', label: 'History', icon: <HistoryIcon /> },
    { to: '/calendar', label: 'Calendar', icon: <CalendarMonthIcon /> },
    { to: '/analytics', label: 'Analytics', icon: <InsightsIcon /> },
  ];

  const currentDrawerWidth = collapsed ? 72 : drawerWidth;

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} className="bg-gray-900 text-white">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        <Typography variant="h6" className="text-white" sx={{ opacity: collapsed ? 0 : 1, transition: 'opacity 150ms' }}>
          Eggmotions
        </Typography>
      </Box>
      <Divider className="!border-gray-800" />
      <List sx={{ display: 'flex', flexDirection: 'column', py: 0 }}>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                '&.active': { bgcolor: 'rgba(124, 58, 237, 0.15)' },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: 'center',
                color: 'rgba(209,213,219,1)'
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      {user && (
        <Box sx={{ p: 2 }}>
          <Divider className="!border-gray-800 mb-2" />
          <Box className="flex items-center gap-3">
            <Avatar alt={user.email} src="" sx={{ width: 32, height: 32 }} />
            {!collapsed && (
              <Box>
                <Typography variant="body2" className="text-gray-300">{user.email}</Typography>
                <Button size="small" variant="outlined" color="error" onClick={logout} className="!mt-1">
                  Cerrar sesión
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }} className="bg-gray-900 text-white min-h-screen">
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          bgcolor: '#111827',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navItems.find(n => n.to === window.location.pathname)?.label || 'Eggmotions'}
          </Typography>
          <IconButton color="inherit" onClick={handleCollapseToggle} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            <MenuOpenIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0f172a', color: '#fff' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: currentDrawerWidth, bgcolor: '#0f172a', color: '#fff', transition: 'width 150ms' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${currentDrawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 