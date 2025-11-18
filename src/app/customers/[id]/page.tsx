'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { customersAPI, accountsAPI, type Customer, type Account } from '@/lib/api';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { ArrowLeft, CheckCircle, XCircle, Loader2, User, Building, Mail, Phone, MapPin, Hash } from 'lucide-react';

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [customerData, accountsData] = await Promise.all([
          customersAPI.get(customerId),
          accountsAPI.list(customerId),
        ]);
        setCustomer(customerData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [customerId]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await customersAPI.updateStatus(customerId, 'approved');
      setShowApproveModal(false);
      // Refresh data
      const updatedCustomer = await customersAPI.get(customerId);
      setCustomer(updatedCustomer);
      alert('Customer approved successfully!');
    } catch (error) {
      console.error('Error approving customer:', error);
      alert('Failed to approve customer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await customersAPI.updateStatus(customerId, 'rejected');
      setShowRejectModal(false);
      // Refresh data
      const updatedCustomer = await customersAPI.get(customerId);
      setCustomer(updatedCustomer);
      alert('Customer rejected');
    } catch (error) {
      console.error('Error rejecting customer:', error);
      alert('Failed to reject customer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !customer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const canApproveOrReject = customer.status === 'pending_kyc' || customer.status === 'pending';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => router.back()}>
          Back
        </Button>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">
              {customer.type === 'individual'
                ? `${customer.first_name} ${customer.last_name}`
                : customer.business_name}
            </h1>
            <p className="text-dark-500 mt-1">Customer ID: {customer.id}</p>
          </div>
          <div className="flex gap-3">
            {canApproveOrReject && (
              <>
                <Button
                  variant="primary"
                  icon={CheckCircle}
                  onClick={() => setShowApproveModal(true)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={() => setShowRejectModal(true)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-dark-500 mb-1">Type</dt>
                  <dd className="flex items-center gap-2 text-dark-900">
                    {customer.type === 'individual' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Building className="h-4 w-4" />
                    )}
                    <span className="capitalize">{customer.type}</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-dark-500 mb-1">Email</dt>
                  <dd className="flex items-center gap-2 text-dark-900">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-dark-500 mb-1">Phone</dt>
                  <dd className="flex items-center gap-2 text-dark-900">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </dd>
                </div>

                {customer.date_of_birth && (
                  <div>
                    <dt className="text-sm font-medium text-dark-500 mb-1">Date of Birth</dt>
                    <dd className="text-dark-900">{formatDate(customer.date_of_birth)}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-dark-500 mb-1">Tax ID</dt>
                  <dd className="flex items-center gap-2 text-dark-900">
                    <Hash className="h-4 w-4" />
                    {customer.tax_id}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-dark-500 mb-1">Created</dt>
                  <dd className="text-dark-900">{formatDate(customer.created_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-dark-400 mt-0.5" />
                <div className="text-dark-900">
                  <p>{customer.address.street}</p>
                  {customer.address.street2 && <p>{customer.address.street2}</p>}
                  <p>
                    {customer.address.city}, {customer.address.state} {customer.address.postal_code}
                  </p>
                  <p>{customer.address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Accounts ({accounts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-center text-dark-500 py-8">No accounts yet</p>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border border-dark-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-dark-900 capitalize">
                          {account.type} Account
                        </p>
                        <p className="text-sm text-dark-500">
                          ****{account.account_number.slice(-4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-dark-900">
                          {formatCurrency(account.balance_available)}
                        </p>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(account.status)}`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
              
              {canApproveOrReject && (
                <div className="mt-4 p-4 bg-accent-50 rounded-lg">
                  <p className="text-sm text-accent-900 font-medium">Action Required</p>
                  <p className="text-xs text-accent-700 mt-1">
                    This customer is pending approval. Review the information and approve or reject.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canApproveOrReject ? (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    icon={CheckCircle}
                    onClick={() => setShowApproveModal(true)}
                  >
                    Approve Customer
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    icon={XCircle}
                    onClick={() => setShowRejectModal(true)}
                  >
                    Reject Customer
                  </Button>
                </>
              ) : (
                <p className="text-sm text-dark-500 text-center py-4">
                  No actions available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Approve Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-600 mb-6">
                Are you sure you want to approve this customer? This will change their status to "approved" and they will be able to access their account.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowApproveModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  loading={actionLoading}
                  icon={CheckCircle}
                >
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Reject Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-dark-600 mb-6">
                Are you sure you want to reject this customer? This action will change their status to "rejected".
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  loading={actionLoading}
                  icon={XCircle}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
