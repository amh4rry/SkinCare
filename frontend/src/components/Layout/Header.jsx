import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode,
  LightMode,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../../context/AuthContext'
import { useTheme as useCustomTheme } from '../../context/ThemeContext'
import './Header.css'

const Header = ({ onMenuToggle, title = 'Skin Care AI' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { themeMode, toggleTheme } = useCustomTheme()

  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchor, setNotificationAnchor] = useState(null)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null)
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    logout()
    navigate('/login')
  }

  const handleProfileClick = () => {
    handleProfileMenuClose()
    navigate('/profile')
  }

  const handleDashboardClick = () => {
    navigate('/dashboard')
  }

  return (
    <AppBar 
      position="sticky" 
      className="app-header"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar className="header-toolbar">
        {/* Left Side - Menu & Title */}
        <Box className="header-left">
          {isMobile && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={onMenuToggle}
                className="menu-button"
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDashboardClick}
            className="header-title-container"
          >
            <DashboardIcon className="title-icon" />
            <Typography 
              variant="h6" 
              component="h1" 
              className="header-title"
            >
              {title}
            </Typography>
          </motion.div>
        </Box>

        {/* Right Side - Actions */}
        <Box className="header-right">
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                className="theme-toggle"
              >
                {themeMode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </motion.div>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <motion.div whileTap={{ scale: 0.95 }}>
              <IconButton
                color="inherit"
                onClick={handleNotificationMenuOpen}
                className="notification-button"
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </motion.div>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account">
            <motion.div whileTap={{ scale: 0.95 }}>
              <IconButton
                edge="end"
                aria-label="account"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                className="profile-button"
              >
                {user?.profilePicture ? (
                  <Avatar 
                    src={user.profilePicture} 
                    alt={user.firstName}
                    className="profile-avatar"
                  />
                ) : (
                  <Avatar className="profile-avatar">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
            </motion.div>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          className="profile-menu"
        >
          <MenuItem onClick={handleProfileClick} className="menu-item">
            <AccountCircle className="menu-icon" />
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')} className="menu-item">
            <SettingsIcon className="menu-icon" />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} className="menu-item logout-item">
            <LogoutIcon className="menu-icon" />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          id="notification-menu"
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          className="notification-menu"
        >
          <MenuItem onClick={handleNotificationMenuClose} className="menu-item">
            <Typography variant="body2">
              Welcome to Skin Care AI! Complete your profile to get started.
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose} className="menu-item">
            <Typography variant="body2">
              Your morning routine reminder is set for 8:00 AM
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose} className="menu-item">
            <Typography variant="body2">
              New product recommendations available based on your skin profile
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
