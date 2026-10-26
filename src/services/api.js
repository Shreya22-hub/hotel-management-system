const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('rajvilas_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || 'API request failed');
  }
  return res.json();
};

export const api = {
  // Health
  checkHealth: async () => {
    return fetch(`${API_BASE}/health`).then(handleResponse);
  },

  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(handleResponse);

    if (res && res.token) {
      localStorage.setItem('rajvilas_token', res.token);
    }
    return res;
  },

  getCurrentUser: async () => {
    return fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },

  logout: () => {
    localStorage.removeItem('rajvilas_token');
  },

  // Rooms
  getRooms: async () => {
    return fetch(`${API_BASE}/rooms`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  updateRoomStatus: async (roomId, status) => {
    return fetch(`${API_BASE}/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse);
  },
  inspectRoom: async (roomNumber, notes) => {
    return fetch(`${API_BASE}/rooms/${roomNumber}/inspect`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    }).then(handleResponse);
  },

  // Reservations
  getReservations: async () => {
    return fetch(`${API_BASE}/reservations`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  createReservation: async (data) => {
    return fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse);
  },
  updateReservationStatus: async (resId, status) => {
    return fetch(`${API_BASE}/reservations/${resId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse);
  },
  cancelReservation: async (resId, reason) => {
    return fetch(`${API_BASE}/reservations/${resId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    }).then(handleResponse);
  },
  settleCheckout: async (resId, paymentMethod) => {
    return fetch(`${API_BASE}/reservations/${resId}/settle-checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentMethod })
    }).then(handleResponse);
  },
  verifyId: async (resId, idType, idNumber) => {
    return fetch(`${API_BASE}/reservations/${resId}/verify-id`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ idType, idNumber })
    }).then(handleResponse);
  },

  // Bills
  getBills: async () => {
    return fetch(`${API_BASE}/bills`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  toggleBillStatus: async (billId) => {
    return fetch(`${API_BASE}/bills/${billId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  addExtraCharge: async (billId, description, amount) => {
    return fetch(`${API_BASE}/bills/${billId}/extra-charge`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ description, amount })
    }).then(handleResponse);
  },

  // Inventory
  getInventory: async () => {
    return fetch(`${API_BASE}/inventory`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  adjustInventory: async (itemId, delta) => {
    return fetch(`${API_BASE}/inventory/${itemId}/adjust`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ delta })
    }).then(handleResponse);
  },
  restockInventory: async (itemId) => {
    return fetch(`${API_BASE}/inventory/${itemId}/restock`, {
      method: 'POST',
      headers: getAuthHeaders()
    }).then(handleResponse);
  },

  // Logs
  getLogs: async () => {
    return fetch(`${API_BASE}/logs`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },
  addLog: async (message, category, author) => {
    return fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, category, author })
    }).then(handleResponse);
  },

  // Database Reset (Admin Only)
  resetDatabase: async () => {
    return fetch(`${API_BASE}/seed/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    }).then(handleResponse);
  }
};
