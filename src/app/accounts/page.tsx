'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { accountsAPI, type Account } from '@/lib/api';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Loader2, Building2, Search } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        const data = await accountsAPI.list();
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    return (
      searchTerm === '' ||
      account.account_number.includes(searchTerm) ||
      account.id.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance_available, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Accounts</h1>
        <p className="text-dark-500 mt-1">
          {filteredAccounts.length} account(s) • Total: {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search by account number or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      {filteredAccounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-dark-300 mb-4" />
          <h3 className="text-lg font-medium text-dark-900 mb-2">
            {searchTerm ? 'No accounts found' : 'No accounts yet'}
          </h3>
          <p className="text-dark-500">
            {searchTerm ? 'Try a different search term' : 'Accounts will appear when customers are approved'}
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 border-b border-dark-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-dark-100">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-dark-900">
                          ****{account.account_number.slice(-4)}
                        </p>
                        <p className="text-xs text-dark-500">
                          ID: {account.id.slice(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-600 capitalize">
                        {account.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-dark-900">
                          {formatCurrency(account.balance_available)}
                        </p>
                        {account.balance_hold > 0 && (
                          <p className="text-xs text-dark-500">
                            {formatCurrency(account.balance_hold)} on hold
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-600">{account.currency}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-600">
                        {formatDate(account.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
