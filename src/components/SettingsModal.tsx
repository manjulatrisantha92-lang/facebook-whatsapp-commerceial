import React, { useState, useEffect, useRef } from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  Building,
  CreditCard,
  Truck,
  Share2,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { selectedTenant, updateTenant, showToast } = useCommerce();

  const [name, setName] = useState(selectedTenant.name);
  const [logoUrl, setLogoUrl] = useState(selectedTenant.logoUrl || '');
  const [whatsappNumber, setWhatsappNumber] = useState(selectedTenant.whatsappNumber);
  const [defaultCourierCharge, setDefaultCourierCharge] = useState(
    selectedTenant.defaultCourierCharge
  );
  const [metaPageName, setMetaPageName] = useState(selectedTenant.metaPageName);
  const [metaPageId, setMetaPageId] = useState(selectedTenant.metaPageId);

  // Bank details
  const [bankName, setBankName] = useState(selectedTenant.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(
    selectedTenant.bankDetails.accountNumber
  );
  const [accountName, setAccountName] = useState(
    selectedTenant.bankDetails.accountName
  );
  const [branch, setBranch] = useState(selectedTenant.bankDetails.branch);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when selected business changes
  useEffect(() => {
    setName(selectedTenant.name);
    setLogoUrl(selectedTenant.logoUrl || '');
    setWhatsappNumber(selectedTenant.whatsappNumber);
    setDefaultCourierCharge(selectedTenant.defaultCourierCharge);
    setMetaPageName(selectedTenant.metaPageName);
    setMetaPageId(selectedTenant.metaPageId);
    setBankName(selectedTenant.bankDetails.bankName);
    setAccountNumber(selectedTenant.bankDetails.accountNumber);
    setAccountName(selectedTenant.bankDetails.accountName);
    setBranch(selectedTenant.bankDetails.branch);
  }, [selectedTenant]);

  // Sample Logo Presets for quick selection
  const sampleLogos = [
    {
      title: 'Modern Tech Icon',
      url: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=150&auto=format&fit=crop&q=80'
    },
    {
      title: 'Minimal Retail Badge',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80'
    },
    {
      title: 'Ceylon Gold Motif',
      url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&auto=format&fit=crop&q=80'
    },
    {
      title: 'Fashion Emblem',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80'
    }
  ];

  // Handle local file upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          showToast(`Logo attached from file: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      setLogoUrl(customUrl.trim());
      setCustomUrl('');
      setShowUrlInput(false);
      showToast('Logo URL applied');
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    showToast('Company logo removed (Optional)', 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenant({
      ...selectedTenant,
      name: name.trim() || selectedTenant.name,
      logoUrl: logoUrl.trim(),
      whatsappNumber,
      defaultCourierCharge: Number(defaultCourierCharge) || 0,
      metaPageName,
      metaPageId,
      bankDetails: {
        ...selectedTenant.bankDetails,
        bankName,
        accountNumber,
        accountName,
        branch
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Store & Business Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure company branding, WhatsApp API, bank accounts, and islandwide courier rates
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Branding & Optional Logo */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>Company Brand & Logo</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Optional
                  </span>
                </h2>
              </div>
            </div>
            {logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Logo
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo Preview Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shadow-xs">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <Building className="w-7 h-7 text-slate-300 mx-auto mb-0.5" />
                    <span className="text-[9px] text-slate-400 font-semibold block leading-tight">
                      No Logo
                    </span>
                  </div>
                )}
              </div>
              {logoUrl && (
                <div
                  title="Active Logo"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full text-white flex items-center justify-center text-xs shadow-md border-2 border-white"
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Logo Controls */}
            <div className="flex-1 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Add an optional company logo to appear on your top navigation bar, customer WhatsApp greeting portal, and invoice receipts.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  {showUrlInput ? 'Cancel URL' : 'Paste Logo URL'}
                </button>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Clear (Keep Blank)
                  </button>
                )}
              </div>

              {/* Paste URL Box */}
              {showUrlInput && (
                <div className="flex items-center gap-2 pt-1 max-w-lg">
                  <input
                    type="text"
                    placeholder="Enter image URL (https://example.com/logo.png)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Quick Sample Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Presets:
                </span>
                {sampleLogos.map((sample) => (
                  <button
                    key={sample.title}
                    type="button"
                    onClick={() => {
                      setLogoUrl(sample.url);
                      showToast(`Applied preset: ${sample.title}`);
                    }}
                    className="text-[10px] bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-md px-2 py-1 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Business Profile Details */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">Business Profile Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official WhatsApp Business Number
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Courier & Delivery Defaults */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-orange-600" />
            <h2 className="font-bold text-sm text-slate-900">Courier & Islandwide Rates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Islandwide Courier Charge ({selectedTenant.currency})
              </label>
              <input
                type="number"
                min="0"
                value={defaultCourierCharge}
                onChange={(e) => setDefaultCourierCharge(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard charge applied to customer delivery form unless custom item rate is set.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Delivery SLA
              </label>
              <input
                type="text"
                readOnly
                value="24 to 48 Hours Islandwide"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Bank Details for Customer Receipt Uploads */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-sm text-slate-900">
              Bank Deposit Information (Presented to Customers on Order Form)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Commercial Bank of Ceylon"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 8004592019"
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Name / Title
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. Apex Mobile Solutions (Pvt) Ltd"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Kollupitiya Branch"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Facebook Page Integration */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900">Meta / Facebook Page Settings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Facebook Page Name
              </label>
              <input
                type="text"
                value={metaPageName}
                onChange={(e) => setMetaPageName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Page ID / Graph Token
              </label>
              <input
                type="text"
                value={metaPageId}
                onChange={(e) => setMetaPageId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
};
