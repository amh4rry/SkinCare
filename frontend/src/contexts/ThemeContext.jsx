import React, { createContext, useContext, useState, useEffect } from 'react'

// Theme context
const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('themeMode')
    if (savedTheme) {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  }

  const [themeMode, setThemeMode] = useState(getInitialTheme)

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a theme
      if (!localStorage.getItem('themeMode')) {
        setThemeMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Update document theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
    
    // Update meta theme-color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeMode === 'dark' ? '#1a1a1a' : '#1976d2')
    }
  }, [themeMode])

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
    localStorage.setItem('themeMode', newTheme)
  }

  // Set specific theme
  const setTheme = (theme) => {
    if (theme === 'system') {
      localStorage.removeItem('themeMode')
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setThemeMode(systemTheme)
    } else {
      setThemeMode(theme)
      localStorage.setItem('themeMode', theme)
    }
  }

  // Check if system theme is dark
  const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  const value = {
    themeMode,
    toggleTheme,
    setTheme,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
    isSystemDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

export default ThemeContext
