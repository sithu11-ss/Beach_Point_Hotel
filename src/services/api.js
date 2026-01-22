const normalizeApiBaseUrl = (raw) => {
  const base = (raw || 'http://localhost:5000').replace(/\/+$/, '');
  // Allow either http://localhost:5000 OR http://localhost:5000/api in env.
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.REACT_APP_API_URL);

// Helper function to get admin token from localStorage
const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Helper function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get admin token if available (for admin requests)
  const adminToken = getAdminToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.error || data.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('API Error:', {
        url,
        status: response.status,
        error: errorMessage,
        data
      });
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Rooms API
export const roomsAPI = {
  getAll: () => apiCall('/rooms'),
  getById: (id) => apiCall(`/rooms/${id}`),
  create: (roomData) => apiCall('/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData)
  }),
  update: (id, roomData) => apiCall(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  }),
  delete: (id) => apiCall(`/rooms/${id}`, {
    method: 'DELETE'
  }),
  checkAvailability: (id, checkIn, checkOut) => 
    apiCall(`/rooms/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`)
};

// Menu API
export const menuAPI = {
  getAll: () => apiCall('/menu'),
  getById: (id) => apiCall(`/menu/${id}`),
  create: (menuData) => apiCall('/menu', {
    method: 'POST',
    body: JSON.stringify(menuData)
  }),
  update: (id, menuData) => apiCall(`/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuData)
  }),
  delete: (id) => apiCall(`/menu/${id}`, {
    method: 'DELETE'
  })
};

// Bookings API
export const bookingsAPI = {
  getAll: () => apiCall('/bookings'),
  getById: (id) => apiCall(`/bookings/${id}`),
  create: (bookingData) => apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  update: (id, bookingData) => apiCall(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookingData)
  }),
  cancel: (id) => apiCall(`/bookings/${id}/cancel`, {
    method: 'PUT'
  }),
  getByReference: (reference) => apiCall(`/bookings/reference/${reference}`)
};

// Users API
export const usersAPI = {
  register: (userData) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getMe: (token) => apiCall('/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
};

// Reservations API
export const reservationsAPI = {
  getAll: (token) => apiCall('/reservations', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  getById: (id, token) => apiCall(`/reservations/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  create: (reservationData) => apiCall('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData)
  }),
  update: (id, reservationData, token) => apiCall(`/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reservationData)
  }),
  cancel: (id, token) => apiCall(`/reservations/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
};

// Admin API
export const adminAPI = {
  getStats: (token) => apiCall('/admin/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
};
