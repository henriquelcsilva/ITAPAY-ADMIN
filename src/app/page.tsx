'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/Card';
import { customersAPI, accountsAPI, type Customer, type Account } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Users, Building2, DollarSign, Activity, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [customersData, accountsData] = await Promise.all([
          customersAPI.list(),
          accountsAPI.list(),
        ]);
        setCustomers(customersData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active' || c.status === 'approved').length,
    pendingCustomers: customers.filter(c => c.status === 'pending_kyc' || c.status === 'pending').length,
    totalAccounts: accounts.length,
    totalBalance: accounts.reduce((sum, acc) => sum + acc.balance_available, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Dashboard</h1>
        <p className="text-dark-500 mt-1">Welcome to ItaPay Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-500">Total Customers</p>
                <p className="text-3xl font-bold text-dark-900 mt-2">{stats.totalCustomers}</p>
                <p className="text-xs text-dark-400 mt-1">{stats.activeCustomers} active</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-500">Pending KYC</p>
                <p className="text-3xl font-bold text-dark-900 mt-2">{stats.pendingCustomers}</p>
                <p className="text-xs text-dark-400 mt-1">
                  {stats.pendingCustomers > 0 ? 'Needs review' : 'All reviewed'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <Activity className="h-6 w-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-500">Total Accounts</p>
                <p className="text-3xl font-bold text-dark-900 mt-2">{stats.totalAccounts}</p>
                <p className="text-xs text-dark-400 mt-1">
                  {accounts.filter(a => a.status === 'open').length} open
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-500">Total Balance</p>
                <p className="text-3xl font-bold text-dark-900 mt-2">
                  {formatCurrency(stats.totalBalance)}
                </p>
                <p className="text-xs text-dark-400 mt-1">Across all accounts</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="px-6 py-4 border-b border-dark-100">
            <h3 className="text-lg font-semibold text-dark-900">Recent Customers</h3>
          </div>
          <CardContent className="p-0">
            {customers.length === 0 ? (
              <div className="p-12 text-center text-dark-500">No customers yet</div>
            ) : (
              <div className="divide-y divide-dark-100">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="p-4 hover:bg-dark-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-dark-900">
                          {customer.type === 'individual'
                            ? `${customer.first_name} ${customer.last_name}`
                            : customer.business_name}
                        </p>
                        <p className="text-sm text-dark-500">{customer.email}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        customer.status === 'active' || customer.status === 'approved'
                          ? 'bg-primary-50 text-primary-700'
                          : customer.status === 'pending_kyc' || customer.status === 'pending'
                          ? 'bg-accent-50 text-accent-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-dark-100">
            <h3 className="text-lg font-semibold text-dark-900">Recent Accounts</h3>
          </div>
          <CardContent className="p-0">
            {accounts.length === 0 ? (
              <div className="p-12 text-center text-dark-500">No accounts yet</div>
            ) : (
              <div className="divide-y divide-dark-100">
                {accounts.slice(0, 5).map((account) => (
                  <div key={account.id} className="p-4 hover:bg-dark-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-dark-900">
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                        </p>
                        <p className="text-sm text-dark-500">****{account.account_number.slice(-4)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-dark-900">{formatCurrency(account.balance_available)}</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.status === 'open'
                            ? 'bg-primary-50 text-primary-700'
                            : 'bg-dark-100 text-dark-700'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
