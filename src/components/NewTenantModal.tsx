import React, { useState, useEffect } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { X, Building2, CheckCircle2 } from 'lucide-react';

export const NewTenantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { addTenant } = useCommerce();

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('+94 77 ');
  const [logoUrl, setLogoUrl] = useState(
    'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=150&auto=format&fit=crop&q=80'
  );
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [branch, setBranch] = useState('Colombo Main');
  const [metaPageName, setMetaPageName] = useState('');
  const [plan, setPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    addTenant({
      name,
      slug,
      logoUrl,
      ownerName: ownerName || 'Business Owner',
      ownerEmail: ownerEmail || 'owner@domain.lk',
      whatsappNumber,
      currency: 'Rs.',
      defaultCourierCharge: 450,
      bankDetails: {
        bankName,
        accountNumber: accountNumber || '8001234567',
        accountName: accountName || name,
        branch
      },
      metaPageName: metaPageName || `${name} Official`,
      metaPageId: `fb_${slug}_2026`,
      status: 'active',
      plan
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6 cursor-default"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Register New Business Tenant
            </h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Business / Store Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lanka Tech Store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Phone *
              </label>
              <input
                type="text"
                required
                placeholder="+94 77 123 4567"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Facebook Page Name
            </label>
            <input
              type="text"
              placeholder="e.g. Lanka Tech Store Sri Lanka"
              value={metaPageName}
              onChange={(e) => setMetaPageName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="8001234567"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subscription Plan
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="Starter">Starter (Up to 25 products / 200 orders)</option>
              <option value="Pro">Pro (Up to 100 products / 1,500 orders)</option>
              <option value="Enterprise">Enterprise (Unlimited + Dedicated WhatsApp)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Create Business Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
