import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://itapay-backend.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API] Error:`, error.response?.data || error.message);
    throw error;
  }
);

// ============================================================================
// TYPES
// ============================================================================

export interface Customer {
  id: string;
  type: 'individual' | 'business';
  first_name?: string;
  last_name?: string;
  business_name?: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  tax_id: string;
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Account {
  id: string;
  customer_id: string;
  type: 'checking' | 'savings';
  status: string;
  balance_available: number;
  balance_current: number;
  balance_hold: number;
  account_number: string;
  routing_number: string;
  currency: string;
  name?: string;
  created_at: string;
  updated_at?: string;
}

export interface Transfer {
  id: string;
  account_id: string;
  counterparty_id?: string;
  type: string;
  direction: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

// ============================================================================
// CUSTOMERS API
// ============================================================================

export const customersAPI = {
  list: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  get: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Customer> => {
    const response = await api.patch(`/customers/${id}/status`, { status });
    return response.data;
  },
};

// ============================================================================
// ACCOUNTS API
// ============================================================================

export const accountsAPI = {
  list: async (customerId?: string): Promise<Account[]> => {
    const params = customerId ? { customerId } : {};
    const response = await api.get('/accounts', { params });
    return response.data;
  },

  get: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  getBalance: async (id: string) => {
    const response = await api.get(`/accounts/${id}/balance`);
    return response.data;
  },
};

// ============================================================================
// TRANSFERS API
// ============================================================================

export const transfersAPI = {
  list: async (accountId?: string): Promise<Transfer[]> => {
    try {
      const params = accountId ? { accountId } : {};
      const response = await api.get('/transfers', { params });
      return response.data;
    } catch (error) {
      console.warn('Transfers endpoint not available yet');
      return [];
    }
  },
};

export default api;
