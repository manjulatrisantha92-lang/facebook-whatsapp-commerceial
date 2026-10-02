import React from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  LayoutDashboard,
  Package,
  Share2,
  ShoppingCart,
  Receipt,
  MessageSquare,
  Settings,
  Shield,
  Truck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    orders,
    products,
    currentRole,
    selectedTenant
  } = useCommerce();

  // Counts for badges
  const pendingPaymentsCount = orders.filter(
    (o) => o.paymentStatus === 'RECEIPT_UPLOADED' && o.tenantId === selectedTenant.id
  ).length;

  const newOrdersCount = orders.filter(
    (o) => (o.orderStatus === 'NEW' || o.orderStatus === 'CUSTOMER_DETAILS_RECEIVED') && o.tenantId === selectedTenant.id
  ).length;

  const activeProductsCount = products.filter(
    (p) => p.active && p.tenantId === selectedTenant.id
  ).length;

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: string | number | null;
    badgeColor?: string;
    staffHidden?: boolean;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: activeProductsCount > 0 ? activeProductsCount : null
    },
    {
      id: 'facebook',
      label: 'Facebook Promotion',
      icon: Share2,
      badge: null
    },
    {
      id: 'orders',
      label: 'Orders & WhatsApp',
      icon: ShoppingCart,
      badge: newOrdersCount > 0 ? newOrdersCount : null,
      badgeColor: 'bg-emerald-500 text-white'
    },
    {
      id: 'payments',
      label: 'Payment Receipts',
      icon: Receipt,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
      badgeColor: 'bg-amber-500 text-slate-900 font-bold'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Bot Desk',
      icon: MessageSquare,
      badge: null
    },
    {
      id: 'settings',
      label: 'Store Settings',
      icon: Settings,
      badge: null,
      staffHidden: currentRole === 'staff'
    }
  ];

  if (currentRole === 'super_admin') {
    navItems.push({
      id: 'superadmin',
      label: 'WCS Super Admin',
      icon: Shield,
      badge: 'Admin'
    });
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-53px)] select-none">
      {/* Business Mini Info */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedTenant.logoUrl}
              alt={selectedTenant.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate">
              {selectedTenant.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>WhatsApp Active</span>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-slate-800/60 rounded-lg p-2.5 text-[11px] text-slate-300 flex items-center justify-between border border-slate-800">
          <span className="text-slate-400">FB Page:</span>
          <span className="font-semibold text-slate-200 truncate max-w-[130px]">
            {selectedTenant.metaPageName}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-2 space-y-1 flex-1">
        {navItems.map((item) => {
          if (item.staffHidden) return null;
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Courier & WhatsApp API Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="rounded-xl bg-slate-800/50 border border-slate-800 p-3 text-[11px] text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Default Courier:</span>
            <span className="font-bold text-white">Rs. {selectedTenant.defaultCourierCharge}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Bank Details:</span>
            <span className="text-emerald-400 truncate max-w-[110px]">
              {selectedTenant.bankDetails.bankName.split(' ')[0]}
            </span>
          </div>
          <div className="pt-1 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>WhatsApp Cloud API</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> v20.0
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
