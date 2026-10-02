import React, { useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { Tenant } from '../types';
import {
  ShieldCheck,
  Building2,
  Plus,
  CheckCircle2,
  Ban,
  TrendingUp,
  Server,
  Layers,
  ExternalLink,
  Users,
  CreditCard,
  Search
} from 'lucide-react';

export const SuperAdminView: React.FC<{ onOpenNewTenant: () => void }> = ({
  onOpenNewTenant
}) => {
  const {
    tenants,
    setSelectedTenant,
    updateTenant,
    orders,
    products
  } = useCommerce();

  const [searchTerm, setSearchTerm] = useState('');

  const toggleTenantStatus = (tenant: Tenant) => {
    const nextStatus = tenant.status === 'active' ? 'suspended' : 'active';
    updateTenant({ ...tenant, status: nextStatus });
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.whatsappNumber.includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                WCS Super Admin Management
              </h1>
              <p className="text-xs text-slate-400">
                Multi-Tenant Architecture · Sri Lanka Social Commerce SaaS Platform
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewTenant}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Provision New Business Tenant
        </button>
      </div>

      {/* Super Admin Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Registered Businesses</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono">
            {tenants.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active enterprise SaaS tenants</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Catalog Products</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono">
            {products.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all Sri Lankan stores</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total System Orders</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono">
            {orders.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Facebook-to-WhatsApp pipeline</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Meta & WhatsApp API Status</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-emerald-600 font-bold text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>99.98% Operational</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">WhatsApp Cloud API Webhooks</p>
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Registered Commercial Businesses</h3>
            <p className="text-xs text-slate-500">
              Each tenant has strict isolation with isolated tenantId records
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search business, owner, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Tenant ID</th>
                <th className="py-3 px-4">Owner & WhatsApp</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTenants.map((t) => {
                const tenantProds = products.filter((p) => p.tenantId === t.id).length;
                const tenantOrds = orders.filter((o) => o.tenantId === t.id).length;

                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={t.logoUrl}
                          alt={t.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-[10px] text-slate-400">{t.metaPageName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {t.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{t.ownerName}</div>
                      <div className="text-[11px] text-emerald-700 font-mono">
                        {t.whatsappNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {t.plan}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {tenantProds}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {tenantOrds}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTenant(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] cursor-pointer"
                        >
                          Switch To
                        </button>
                        <button
                          onClick={() => toggleTenantStatus(t)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                            t.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {t.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
