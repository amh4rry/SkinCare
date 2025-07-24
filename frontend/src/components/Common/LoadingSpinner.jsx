import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import './LoadingSpinner.css'

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...', 
  fullScreen = false,
  color = 'primary' 
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}
    >
      <Box className="loading-content">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <CircularProgress 
            size={size} 
            color={color}
            thickness={4}
          />
        </motion.div>
        
        {message && (
          <Typography 
            variant="body2" 
            color="textSecondary" 
            className="loading-message"
          >
            {message}
          </Typography>
        )}
      </Box>
    </motion.div>
  )

  return content
}

export default LoadingSpinner
