import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
}

// Action types
const actionTypes = {
  SET_AUTH_START: 'SET_AUTH_START',
  SET_AUTH_SUCCESS: 'SET_AUTH_SUCCESS',
  SET_AUTH_ERROR: 'SET_AUTH_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    
    case actionTypes.SET_AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    
    case actionTypes.SET_AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
      }
    
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      }
    
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      }
    
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      }
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set up axios interceptors
  useEffect(() => {
    // Request interceptor to add token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token expiry
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && state.token) {
          // Token expired or invalid
          logout()
          toast.error('Session expired. Please log in again.')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [state.token])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        dispatch({ type: actionTypes.SET_AUTH_ERROR, payload: null })
        return
      }

      try {
        dispatch({ type: actionTypes.SET_AUTH_START })
        
        const response = await axios.post('/api/auth/verify-token', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          dispatch({
            type: actionTypes.SET_AUTH_SUCCESS,
            payload: {
              user: response.data.data.user,
              token: token,
            },
          })
        } else {
          throw new Error('Token verification failed')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        dispatch({ type: actionTypes.SET_AUTH_ERROR, payload: null })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: actionTypes.SET_AUTH_START })

      const response = await axios.post('/api/auth/login', {
        email,
        password,
      })

      if (response.data.success) {
        const { user, token } = response.data.data
        
        localStorage.setItem('token', token)
        
        dispatch({
          type: actionTypes.SET_AUTH_SUCCESS,
          payload: { user, token },
        })

        toast.success(`Welcome back, ${user.firstName}!`)
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      
      dispatch({ type: actionTypes.SET_AUTH_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: actionTypes.SET_AUTH_START })

      const response = await axios.post('/api/auth/register', userData)

      if (response.data.success) {
        const { user, token } = response.data.data
        
        localStorage.setItem('token', token)
        
        dispatch({
          type: actionTypes.SET_AUTH_SUCCESS,
          payload: { user, token },
        })

        toast.success(`Welcome to Skin Care AI, ${user.firstName}!`)
        return { success: true }
      } else {
        throw new Error(response.data.message || 'Registration failed')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      
      dispatch({ type: actionTypes.SET_AUTH_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: actionTypes.LOGOUT })
    toast.success('Logged out successfully')
  }

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: actionTypes.UPDATE_USER, payload: userData })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR })
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token')
      
      if (response.data.success) {
        const { user, token } = response.data.data
        
        localStorage.setItem('token', token)
        
        dispatch({
          type: actionTypes.SET_AUTH_SUCCESS,
          payload: { user, token },
        })
        
        return { success: true }
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return { success: false }
    }
  }

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext
