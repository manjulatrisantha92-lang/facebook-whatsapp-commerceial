import React, { useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  Building2,
  ChevronDown,
  UserCheck,
  Smartphone,
  RotateCcw,
  Sparkles,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { UserRole, Tenant } from '../types';

interface HeaderProps {
  onOpenNewTenant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTenant }) => {
  const {
    tenants,
    selectedTenant,
    setSelectedTenant,
    currentRole,
    setCurrentRole,
    setCustomerModalOpen,
    resetAllData,
    products
  } = useCommerce();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; badge: string; desc: string }[] = [
    {
      role: 'business_owner',
      label: 'Business Owner',
      badge: 'Full Access',
      desc: 'Can manage products, orders, payments, Facebook ads, and store settings'
    },
    {
      role: 'staff',
      label: 'Store Staff',
      badge: 'Restricted',
      desc: 'Can view orders, update courier status, view products (no payments/settings)'
    },
    {
      role: 'super_admin',
      label: 'WCS Super Admin',
      badge: 'System Admin',
      desc: 'Can manage all business tenants, subscriptions, and system-wide configurations'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand & Business Switcher */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-black tracking-wider">
              WCS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                  Social Commerce
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  FB & WhatsApp
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Facebook Promotions → WhatsApp Automation → Courier Fulfillment
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Business / Tenant Selector */}
          <div className="relative">
            <button
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-left transition-all"
            >
              {selectedTenant.logoUrl ? (
                <img
                  src={selectedTenant.logoUrl}
                  alt={selectedTenant.name}
                  className="w-5 h-5 rounded object-cover border border-slate-600 shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {selectedTenant.name.charAt(0)}
                </div>
              )}
              <div className="max-w-[130px] sm:max-w-[170px] truncate">
                <div className="font-semibold text-slate-200 truncate leading-tight">
                  {selectedTenant.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {selectedTenant.whatsappNumber}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
            </button>

            {tenantDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTenantDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl py-1 z-50 divide-y divide-slate-800">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Business
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {tenants.map((tenant) => (
                      <button
                        key={tenant.id}
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                          selectedTenant.id === tenant.id
                            ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {tenant.logoUrl ? (
                          <img
                            src={tenant.logoUrl}
                            alt={tenant.name}
                            className="w-6 h-6 rounded object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                            {tenant.name.charAt(0)}
                          </div>
                        )}
                        <div className="truncate flex-1">
                          <div className="truncate">{tenant.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {tenant.plan} · {tenant.whatsappNumber}
                          </div>
                        </div>
                        {selectedTenant.id === tenant.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setTenantDropdownOpen(false);
                        onOpenNewTenant();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors font-medium"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add New Business Tenant
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Try Customer Flow Button */}
          <button
            onClick={() => setCustomerModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg shadow-sm shadow-emerald-950 transition-all cursor-pointer"
            title="Experience the Facebook ad click to WhatsApp and Order placement as a customer"
          >
            <Smartphone className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Try as</span> Customer Flow
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline capitalize">
                {currentRole.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulate Role & Permissions
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                        currentRole === r.role
                          ? 'bg-slate-800 text-emerald-400 font-semibold'
                          : 'text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{r.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                        {r.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={resetAllData}
            title="Reset to initial sample products & orders"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
