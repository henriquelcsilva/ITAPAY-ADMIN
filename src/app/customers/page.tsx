'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { customersAPI, type Customer } from '@/lib/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Loader2, User, Building, Search, Filter } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const data = await customersAPI.list();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm === '' ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.business_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold text-dark-900">Customers</h1>
        <p className="text-dark-500 mt-1">{filteredCustomers.length} customer(s)</p>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-dark-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending_kyc">Pending KYC</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center">
          <User className="h-12 w-12 mx-auto text-dark-300 mb-4" />
          <h3 className="text-lg font-medium text-dark-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-dark-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Customers will appear here once they sign up'}
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 border-b border-dark-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-dark-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                          {customer.type === 'individual' ? (
                            <User className="h-5 w-5 text-primary-600" />
                          ) : (
                            <Building className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark-900">
                            {customer.type === 'individual'
                              ? `${customer.first_name} ${customer.last_name}`
                              : customer.business_name}
                          </p>
                          <p className="text-xs text-dark-500">ID: {customer.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-600 capitalize">{customer.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-900">{customer.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-dark-600">{formatDate(customer.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
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
