'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ArrowLeftRight,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Accounts', href: '/accounts', icon: Building2 },
  { name: 'Transfers', href: '/transfers', icon: ArrowLeftRight },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-dark-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-dark-800">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Ita</span>
          <span className="text-primary-500">Pay</span>
          <span className="text-xs text-dark-400 ml-2">ADMIN</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-800 p-4">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-dark-400">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}
