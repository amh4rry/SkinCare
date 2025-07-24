import React, { useState } from 'react'
import { Box, useTheme, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

import Header from './Header'
import Sidebar from './Sidebar'
import './Layout.css'

const Layout = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <Box className="app-layout">
      {/* Header */}
      <Header onMenuToggle={handleSidebarToggle} />
      
      {/* Main Content Area */}
      <Box className="layout-container">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          variant={isMobile ? 'temporary' : 'persistent'}
        />
        
        {/* Main Content */}
        <Box 
          component="main" 
          className={`main-content ${sidebarOpen && !isMobile ? 'sidebar-open' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="content-wrapper"
          >
            <Outlet />
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
