import React, { useState, useEffect } from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  X,
  CheckCircle2,
  XCircle,
  ZoomIn,
  ZoomOut,
  Receipt,
  Building,
  User,
  Phone,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const PaymentVerificationModal: React.FC = () => {
  const {
    receiptModalOrder,
    setReceiptModalOrder,
    verifyPayment,
    rejectPayment,
    selectedTenant,
    showToast
  } = useCommerce();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectBox, setShowRejectBox] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && receiptModalOrder) {
        setReceiptModalOrder(null);
      }
    };
    if (receiptModalOrder) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [receiptModalOrder, setReceiptModalOrder]);

  if (!receiptModalOrder) return null;

  const order = receiptModalOrder;

  const handleApprove = () => {
    verifyPayment(order.id);
    setReceiptModalOrder(null);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejecting the receipt', 'warning');
      return;
    }
    rejectPayment(order.id, rejectReason);
    setReceiptModalOrder(null);
  };

  return (
    <div
      onClick={() => setReceiptModalOrder(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Bank Deposit Slip Inspector · Order {order.orderNumber}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Customer: {order.customerName} ({order.phone1}) · Grand Total: {selectedTenant.currency} {order.grandTotal.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setReceiptModalOrder(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close inspector (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left image preview (high-res), Right verification checklist */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Slip Image Viewport (7 cols) */}
          <div className="md:col-span-7 p-4 bg-slate-900 flex flex-col items-center justify-center relative min-h-[350px]">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-800/90 text-white p-1 rounded-lg border border-slate-700 shadow-md">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                className="p-1 hover:bg-slate-700 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="p-1 hover:bg-slate-700 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-full flex items-center justify-center overflow-auto p-4 max-h-[500px]">
              {order.receiptUrl ? (
                <img
                  src={order.receiptUrl}
                  alt="Customer Payment Receipt"
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-h-[440px] w-auto object-contain rounded-lg shadow-2xl transition-transform duration-200 border border-slate-700"
                />
              ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Receipt className="w-10 h-10 text-slate-600" />
                  <span>No payment slip image attached</span>
                </div>
              )}
            </div>
          </div>

          {/* Details & Action Pane (5 cols) */}
          <div className="md:col-span-5 p-5 space-y-4 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Deposit Verification Details
              </h3>

              {/* Order financial review */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Bank:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedTenant.bankDetails.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Account:</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {selectedTenant.bankDetails.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Total:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {selectedTenant.currency} {order.grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Bank Reference No:</span>
                  <span className="font-mono font-semibold text-purple-800">
                    {order.paymentReference || 'None specified'}
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Amount matches order grand total</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official bank stamp or online transaction reference visible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deposit date matches current order window</span>
                </div>
              </div>

              {/* Rejection input box if triggered */}
              {showRejectBox && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>State Reason for Rejection</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Deposit amount is short by Rs. 450 courier"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-rose-300 rounded bg-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRejectBox(false)}
                      className="px-2.5 py-1 text-slate-600 text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-3 py-1 bg-rose-600 text-white rounded text-[11px] font-bold"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Decision Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleApprove}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Payment & Notify Customer via WhatsApp
              </button>

              {!showRejectBox && (
                <button
                  onClick={() => setShowRejectBox(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reject Payment Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
