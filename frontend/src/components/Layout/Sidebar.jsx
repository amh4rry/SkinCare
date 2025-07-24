import React, { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
  Recommend as RecommendIcon,
  Schedule as ScheduleIcon,
  TrackChanges as TrackIcon,
  Inventory as ProductsIcon,
  RateReview as ReviewsIcon,
  PhotoCamera as PhotoIcon,
  Analytics as AnalyticsIcon,
  SmartToy as AIIcon,
  AdminPanelSettings as AdminIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const Sidebar = ({ open, onClose, variant = 'temporary' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [expandedMenus, setExpandedMenus] = useState({
    routine: false,
    progress: false,
    admin: false,
  })

  const handleMenuClick = (path) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  const toggleExpandMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const isActive = (path) => location.pathname === path
  const isParentActive = (paths) => paths.some(path => location.pathname.startsWith(path))

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      title: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
    },
    {
      title: 'Questionnaire',
      icon: <QuizIcon />,
      path: '/questionnaire',
    },
    {
      title: 'AI Recommendations',
      icon: <RecommendIcon />,
      path: '/recommendations',
    },
    {
      title: 'Routine',
      icon: <ScheduleIcon />,
      expandable: true,
      key: 'routine',
      children: [
        {
          title: 'Builder',
          icon: <ScheduleIcon />,
          path: '/routine/builder',
        },
        {
          title: 'Tracker',
          icon: <TrackIcon />,
          path: '/routine/tracker',
        },
      ],
    },
    {
      title: 'Products',
      icon: <ProductsIcon />,
      path: '/products',
    },
    {
      title: 'Reviews',
      icon: <ReviewsIcon />,
      path: '/reviews',
    },
    {
      title: 'Progress',
      icon: <PhotoIcon />,
      expandable: true,
      key: 'progress',
      children: [
        {
          title: 'Photos',
          icon: <PhotoIcon />,
          path: '/progress/photos',
        },
        {
          title: 'Analysis',
          icon: <AnalyticsIcon />,
          path: '/progress/analysis',
        },
      ],
    },
    {
      title: 'AI Chat',
      icon: <AIIcon />,
      path: '/ai-chat',
    },
  ]

  // Add admin menu items if user is admin
  if (user?.role === 'admin') {
    menuItems.push({
      title: 'Admin',
      icon: <AdminIcon />,
      expandable: true,
      key: 'admin',
      children: [
        {
          title: 'Dashboard',
          icon: <DashboardIcon />,
          path: '/admin',
        },
        {
          title: 'Products',
          icon: <ProductsIcon />,
          path: '/admin/products',
        },
        {
          title: 'Users',
          icon: <PersonIcon />,
          path: '/admin/users',
        },
        {
          title: 'Reviews',
          icon: <ReviewsIcon />,
          path: '/admin/reviews',
        },
      ],
    })
  }

  const renderMenuItem = (item, index) => {
    const isItemActive = item.path ? isActive(item.path) : false
    const isParentItemActive = item.children 
      ? isParentActive(item.children.map(child => child.path))
      : false

    if (item.expandable) {
      return (
        <Box key={item.key || index}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleExpandMenu(item.key)}
              className={`menu-item ${isParentItemActive ? 'active-parent' : ''}`}
            >
              <ListItemIcon className="menu-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                className="menu-text"
              />
              {expandedMenus[item.key] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <AnimatePresence>
            <Collapse in={expandedMenus[item.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child, childIndex) => (
                  <motion.div
                    key={childIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: childIndex * 0.05 }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleMenuClick(child.path)}
                        className={`menu-item submenu-item ${isActive(child.path) ? 'active' : ''}`}
                      >
                        <ListItemIcon className="menu-icon submenu-icon">
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={child.title}
                          className="menu-text"
                        />
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Collapse>
          </AnimatePresence>
        </Box>
      )
    }

    return (
      <motion.div
        key={index}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMenuClick(item.path)}
            className={`menu-item ${isItemActive ? 'active' : ''}`}
          >
            <ListItemIcon className="menu-icon">
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              className="menu-text"
            />
          </ListItemButton>
        </ListItem>
      </motion.div>
    )
  }

  const drawerContent = (
    <Box className="sidebar-content">
      {/* Sidebar Header */}
      <Box className="sidebar-header">
        <Box className="brand-container">
          <HomeIcon className="brand-icon" />
          <Typography variant="h6" className="brand-text">
            Skin Care AI
          </Typography>
        </Box>
        <Typography variant="body2" className="brand-subtitle">
          Personalized skincare
        </Typography>
      </Box>

      <Divider className="sidebar-divider" />

      {/* User Info */}
      <Box className="user-info">
        <Box className="user-avatar">
          {user?.firstName?.charAt(0)?.toUpperCase()}
        </Box>
        <Box className="user-details">
          <Typography variant="subtitle2" className="user-name">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" className="user-email">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <Divider className="sidebar-divider" />

      {/* Navigation Menu */}
      <List className="navigation-menu">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </List>

      {/* Footer */}
      <Box className="sidebar-footer">
        <Divider className="sidebar-divider" />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick('/settings')}
              className="menu-item"
            >
              <ListItemIcon className="menu-icon">
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Settings"
                className="menu-text"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      className="app-sidebar"
      classes={{
        paper: 'sidebar-paper',
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar
