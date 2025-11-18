'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { ArrowLeftRight, Clock } from 'lucide-react';

export default function TransfersPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Transfers</h1>
        <p className="text-dark-500 mt-1">Transaction history and management</p>
      </div>

      {/* Coming Soon */}
      <Card className="p-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
            <Clock className="h-8 w-8 text-accent-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-dark-900 mb-2">Coming Soon</h3>
        <p className="text-dark-500 max-w-md mx-auto mb-6">
          The transfers feature is currently being developed. Once the backend transfer endpoints are ready, you'll be able to view and manage all transactions here.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">View Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <ArrowLeftRight className="h-8 w-8 text-dark-300 mx-auto mb-2" />
              <p className="text-xs text-dark-500">
                See all transactions across all accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filter & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <ArrowLeftRight className="h-8 w-8 text-dark-300 mx-auto mb-2" />
              <p className="text-xs text-dark-500">
                Filter by date, status, amount, and more
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Export Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ArrowLeftRight className="h-8 w-8 text-dark-300 mx-auto mb-2" />
              <p className="text-xs text-dark-500">
                Download transaction reports as CSV
              </p>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
}
