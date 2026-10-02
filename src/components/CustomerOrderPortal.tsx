import React, { useState, useEffect } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../types';
import {
  X,
  MapPin,
  Upload,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Truck,
  Building,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Navigation,
  RefreshCw,
  Eye
} from 'lucide-react';

interface CustomerOrderPortalProps {
  isOpen: boolean;
  onClose: () => void;
  presetProduct?: Product | null;
}

export const CustomerOrderPortal: React.FC<CustomerOrderPortalProps> = ({
  isOpen,
  onClose,
  presetProduct
}) => {
  const {
    products,
    selectedTenant,
    createOrderFromCustomer,
    setActiveTab
  } = useCommerce();

  const tenantProducts = products.filter((p) => p.tenantId === selectedTenant.id);
  const activeProduct = presetProduct || tenantProducts[0];

  // Steps: 'whatsapp_chat' | 'order_form' | 'order_confirmed'
  const [currentStep, setCurrentStep] = useState<'whatsapp_chat' | 'order_form' | 'order_confirmed'>('whatsapp_chat');

  // Customer Form State
  const [customerName, setCustomerName] = useState('Kasun Perera');
  const [address, setAddress] = useState('No. 42/B, 3rd Lane, Galle Road, Bambalapitiya');
  const [city, setCity] = useState('Colombo 04');
  const [district, setDistrict] = useState('Colombo');
  const [phone1, setPhone1] = useState('+94 77 821 9920');
  const [phone2, setPhone2] = useState('+94 11 258 4401');

  // Geolocation
  const [latitude, setLatitude] = useState<number | undefined>(6.8928);
  const [longitude, setLongitude] = useState<number | undefined>(79.8559);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Payment receipt
  const [receiptUrl, setReceiptUrl] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
  );
  const [paymentReference, setPaymentReference] = useState('COMB-FT-9941829');
  const [copiedBank, setCopiedBank] = useState(false);

  // Submitted order
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('whatsapp_chat');
    }
  }, [isOpen, presetProduct]);

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

  if (!isOpen || !activeProduct) return null;

  const itemTotal = activeProduct.price;
  const courierCharge = activeProduct.courierCharge;
  const grandTotal = itemTotal + courierCharge;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGeoLoading(false);
        setGeoSuccess(true);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback default coordinates (Colombo City) if user denies permission
        setLatitude(6.9271);
        setLongitude(79.8612);
        setGeoLoading(false);
        setGeoSuccess(true);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReceiptUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyAccount = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(selectedTenant.bankDetails.accountNumber).catch(() => {});
      }
    } catch (e) {
      // Ignored if browser restricts clipboard in iframe
    }
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const googleMapsUrl =
      latitude && longitude
        ? `https://maps.google.com/?q=${latitude},${longitude}`
        : undefined;

    const created = createOrderFromCustomer({
      tenantId: selectedTenant.id,
      items: [
        {
          productId: activeProduct.id,
          productName: activeProduct.name,
          sku: activeProduct.sku,
          quantity: 1,
          unitPrice: activeProduct.price,
          image: activeProduct.images[0] || ''
        }
      ],
      itemTotal,
      courierCharge,
      grandTotal,
      customerName,
      address,
      city,
      district,
      phone1,
      phone2,
      latitude,
      longitude,
      googleMapsUrl,
      receiptUrl: receiptUrl || undefined,
      paymentReference,
      source: 'facebook'
    });

    setSubmittedOrderNumber(created.orderNumber);
    setCurrentStep('order_confirmed');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-100 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-700 overflow-hidden my-4 flex flex-col max-h-[92vh] cursor-default"
      >
        {/* Mobile Device Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">Customer Mobile Simulator</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close simulator (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: Simulated WhatsApp Customer Greeting */}
          {currentStep === 'whatsapp_chat' && (
            <div className="p-4 space-y-4 bg-[#0B141A] text-slate-100 min-h-[480px] flex flex-col justify-between">
              {/* WhatsApp Chat Header */}
              <div className="bg-[#202C33] p-3 rounded-xl flex items-center gap-3 border border-slate-700">
                {selectedTenant.logoUrl ? (
                  <img
                    src={selectedTenant.logoUrl}
                    alt={selectedTenant.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 border border-slate-600 flex items-center justify-center text-white font-black text-sm">
                    {selectedTenant.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{selectedTenant.name}</span>
                    <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full text-slate-900 flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    Official WhatsApp Business Account
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 flex-1 py-2">
                {/* Outgoing from customer: clicked FB Ad */}
                <div className="flex justify-end">
                  <div className="bg-[#005C4B] text-slate-100 p-3 rounded-2xl rounded-tr-xs max-w-[85%] text-xs shadow-sm space-y-1">
                    <p className="font-semibold text-emerald-200 text-[10px]">
                      Triggered from Facebook Ad:
                    </p>
                    <p>
                      Hi! I want to order <strong>{activeProduct.name}</strong> ({selectedTenant.currency} {activeProduct.price.toLocaleString()}) with islandwide courier delivery.
                    </p>
                    <span className="text-[9px] text-slate-300 block text-right">09:41 AM ✓✓</span>
                  </div>
                </div>

                {/* Incoming Bot Response */}
                <div className="flex justify-start">
                  <div className="bg-[#202C33] text-slate-100 p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] text-xs shadow-sm space-y-2.5 border border-slate-700">
                    <div className="font-bold text-emerald-400 text-xs">
                      {selectedTenant.name} Automated Sales Assistant
                    </div>
                    <p className="leading-relaxed">
                      Thank you for your purchase request!
                    </p>

                    <div className="bg-[#111B21] p-2.5 rounded-lg border border-slate-700 space-y-1 text-[11px]">
                      <div className="font-bold text-white">{activeProduct.name}</div>
                      <div className="flex justify-between text-slate-300">
                        <span>Item Price:</span>
                        <span className="font-mono">{selectedTenant.currency} {itemTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Islandwide Courier:</span>
                        <span className="font-mono">{selectedTenant.currency} {courierCharge.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-700 pt-1 flex justify-between font-bold text-emerald-400 text-xs">
                        <span>Total Payable:</span>
                        <span className="font-mono">{selectedTenant.currency} {grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Please click the secure delivery link below to provide your address, share your Google GPS pin, and upload the bank payment slip:
                    </p>

                    {/* Interactive Button in WhatsApp */}
                    <button
                      onClick={() => setCurrentStep('order_form')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>📝 Complete Delivery Details</span>
                    </button>
                    <span className="text-[9px] text-slate-400 block text-right">09:41 AM</span>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar (Dummy) */}
              <div className="bg-[#202C33] p-2 rounded-xl flex items-center gap-2 border border-slate-700 text-xs">
                <input
                  type="text"
                  readOnly
                  value="Tap button above to enter delivery details..."
                  className="flex-1 bg-transparent px-2 text-slate-400 outline-none text-xs"
                />
                <button
                  onClick={() => setCurrentStep('order_form')}
                  className="bg-emerald-600 text-white p-2 rounded-lg"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Customer Delivery & Payment Form */}
          {currentStep === 'order_form' && (
            <form onSubmit={handleSubmitOrder} className="p-4 sm:p-5 space-y-4 bg-white">
              {/* Product Header Card */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={
                    activeProduct.images[0] ||
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={activeProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {activeProduct.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    SKU: {activeProduct.sku}
                  </div>
                  <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                    {selectedTenant.currency} {itemTotal.toLocaleString()} + {selectedTenant.currency} {courierCharge} Courier = {selectedTenant.currency} {grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Delivery Information</span>
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full recipient name"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Building No, Street, Landmark"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Colombo 04"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      District
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Matara">Matara</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Other">Other Districts</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Phone Number 2 (Alt)
                    </label>
                    <input
                      type="text"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      placeholder="Alternate phone"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Google Location (Section 9 of user prompt) */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Google Location Pin</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={geoLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                  >
                    {geoLoading ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Navigation className="w-3 h-3" />
                    )}
                    <span>{geoLoading ? 'Detecting...' : '📍 Share My Location'}</span>
                  </button>
                </div>

                {latitude && longitude ? (
                  <div className="text-[11px] bg-white p-2.5 rounded-lg border border-blue-200 space-y-1">
                    <div className="flex items-center justify-between font-mono text-slate-700">
                      <span>Coordinates:</span>
                      <span className="font-bold text-blue-700">
                        {latitude.toFixed(4)}, {longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[10px] flex items-center justify-between">
                      <span>Google Maps URL:</span>
                      <a
                        href={`https://maps.google.com/?q=${latitude},${longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        Preview Map Pin <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-blue-700">
                    Tap "Share My Location" so our islandwide courier riders can locate your house with precision.
                  </p>
                )}
              </div>

              {/* Bank Payment Information (Section 10 of prompt) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>2. Payment Instructions (Bank Transfer / Deposit)</span>
                </h4>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-bold text-slate-900">
                      {selectedTenant.bankDetails.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Account Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-700">
                        {selectedTenant.bankDetails.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="p-1 text-slate-500 hover:text-slate-800 rounded bg-slate-100 cursor-pointer"
                        title="Copy account number"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Name:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedTenant.bankDetails.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Branch:</span>
                    <span className="text-slate-700">
                      {selectedTenant.bankDetails.branch}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                    <span>Total Deposit Amount:</span>
                    <span className="text-emerald-700 font-mono text-sm">
                      {selectedTenant.currency} {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Upload Receipt */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Upload Bank Deposit Slip / Transfer Receipt *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 bg-white text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="receipt-file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="receipt-file"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1 text-xs text-slate-600"
                    >
                      <Upload className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-700">
                        {receiptUrl ? 'Change Receipt Slip' : 'Click to Upload Slip (JPG, PNG, PDF)'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Take a photo of physical bank slip or screenshot of online banking
                      </span>
                    </label>

                    {receiptUrl && (
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <img
                          src={receiptUrl}
                          alt="Slip Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Receipt Attached
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Bank Reference / Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="e.g. COMB-FT-109283"
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  SUBMIT ORDER & UPLOAD RECEIPT
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Confirmation & Live Tracking */}
          {currentStep === 'order_confirmed' && (
            <div className="p-6 bg-white space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Thank You, {customerName}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your purchase request has been submitted to {selectedTenant.name}.
                </p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-full font-mono text-xs font-bold text-slate-900 border border-slate-200">
                  Order Number: {submittedOrderNumber}
                </div>
              </div>

              {/* Order Status Progress Bar (Section 11 of prompt) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Order Progress</span>
                  <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-[10px]">
                    Payment Received · Under Review
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Customer Details & Google GPS Pin Received</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-purple-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span>Payment Slip Uploaded (Admin Verifying...)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>Parcel Packing & Fragile Labeling</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>Handed to Islandwide Courier (Domex / Koombiyo)</span>
                  </div>
                </div>
              </div>

              {/* Action: Switch to Admin View */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('orders');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  View this Order in Admin Dashboard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Close Simulator
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
