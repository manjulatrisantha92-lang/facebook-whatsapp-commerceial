import React, { useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { Order, OrderStatus } from '../types';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  MessageCircle,
  MapPin,
  ExternalLink,
  Receipt,
  Download,
  Phone,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface OrdersManagementProps {
  selectedOrderId?: string | null;
  onCloseOrderDetail?: () => void;
}

export const OrdersManagement: React.FC<OrdersManagementProps> = ({
  selectedOrderId: initialSelectedId,
  onCloseOrderDetail
}) => {
  const {
    orders,
    selectedTenant,
    updateOrderStatus,
    updateOrderCourierCharge,
    verifyPayment,
    rejectPayment,
    updateCourierInfo,
    sendWhatsAppMessage,
    setReceiptModalOrder,
    currentRole,
    showToast
  } = useCommerce();

  const tenantOrders = orders.filter((o) => o.tenantId === selectedTenant.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialSelectedId) {
      return tenantOrders.find((o) => o.id === initialSelectedId) || null;
    }
    return null;
  });

  // Courier edit inputs for selected order
  const [courierCompany, setCourierCompany] = useState('Domex');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierNotes, setCourierNotes] = useState('');

  // Manual Courier Charge state
  const [editingCourierCharge, setEditingCourierCharge] = useState(false);
  const [manualCourierChargeInput, setManualCourierChargeInput] = useState<number>(0);

  // WhatsApp quick custom message
  const [customMsg, setCustomMsg] = useState('');

  // When selected order changes, sync courier form
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCourierCompany(order.courier?.courierCompany || 'Domex');
    setTrackingNumber(order.courier?.trackingNumber || '');
    setCourierNotes(order.courier?.notes || '');
    setManualCourierChargeInput(order.courierCharge || 0);
    setEditingCourierCharge(false);
    setCustomMsg('');
  };

  const filteredOrders = tenantOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone1.includes(searchTerm) ||
      order.items.some((i) => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const orderStatuses: { value: OrderStatus; label: string }[] = [
    { value: 'NEW', label: '1. New Lead' },
    { value: 'CUSTOMER_DETAILS_RECEIVED', label: '2. Details Received' },
    { value: 'PAYMENT_PENDING', label: '3. Payment Pending' },
    { value: 'PAYMENT_RECEIVED', label: '4. Payment Slip Received' },
    { value: 'PAYMENT_VERIFIED', label: '5. Payment Verified' },
    { value: 'PROCESSING', label: '6. Processing / Packing' },
    { value: 'READY_FOR_COURIER', label: '7. Ready for Courier' },
    { value: 'SHIPPED', label: '8. Shipped / Dispatched' },
    { value: 'DELIVERED', label: '9. Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'RETURNED', label: 'Returned' },
    { value: 'PAYMENT_REJECTED', label: 'Payment Rejected' }
  ];

  const statusColors: Record<OrderStatus, string> = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    CUSTOMER_DETAILS_RECEIVED: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    PAYMENT_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    PAYMENT_RECEIVED: 'bg-purple-50 text-purple-700 border-purple-200 font-bold',
    PAYMENT_VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    READY_FOR_COURIER: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
    SHIPPED: 'bg-teal-50 text-teal-700 border-teal-200 font-semibold',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200',
    RETURNED: 'bg-rose-50 text-rose-700 border-rose-200',
    PAYMENT_REJECTED: 'bg-red-50 text-red-700 border-red-200'
  };

  // Quick WhatsApp Template Senders
  const sendWhatsAppTemplate = (templateType: 'details_request' | 'payment_verified' | 'dispatched') => {
    if (!selectedOrder) return;

    if (templateType === 'details_request') {
      sendWhatsAppMessage(
        selectedOrder.id,
        selectedOrder.phone1,
        selectedOrder.customerName,
        `Hello ${selectedOrder.customerName}! Thank you for your inquiry with ${selectedTenant.name}.\n\nTotal for your order ${selectedOrder.orderNumber}: ${selectedTenant.currency} ${selectedOrder.grandTotal.toLocaleString()} (including islandwide courier).\n\nPlease complete your delivery details & share your GPS location here:\n👉 https://${selectedTenant.slug}.lk/order/${selectedOrder.id}`,
        'template'
      );
    } else if (templateType === 'payment_verified') {
      verifyPayment(selectedOrder.id);
    } else if (templateType === 'dispatched') {
      if (!trackingNumber) {
        showToast('Please enter a Courier Tracking Number first', 'warning');
        return;
      }
      updateCourierInfo(selectedOrder.id, {
        courierCompany,
        trackingNumber,
        notes: courierNotes,
        dispatchedAt: new Date().toISOString()
      });
    }
  };

  const handleSendCustomWhatsApp = () => {
    if (!selectedOrder || !customMsg.trim()) return;
    sendWhatsAppMessage(
      selectedOrder.id,
      selectedOrder.phone1,
      selectedOrder.customerName,
      customMsg,
      'text'
    );
    setCustomMsg('');
  };

  // Export CSV function for Courier manifests
  const exportOrdersCSV = () => {
    const headers = [
      'OrderNumber',
      'CustomerName',
      'Phone1',
      'Phone2',
      'Address',
      'City',
      'District',
      'GoogleLocation',
      'GrandTotal',
      'Status',
      'CourierCompany',
      'TrackingNumber'
    ];

    const rows = tenantOrders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.phone1,
      o.phone2 || '',
      `"${o.address.replace(/"/g, '""')}"`,
      o.city || '',
      o.district || '',
      o.googleMapsUrl || '',
      o.grandTotal,
      o.orderStatus,
      o.courier?.courierCompany || '',
      o.courier?.trackingNumber || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${selectedTenant.slug}-orders-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              WhatsApp Orders & Delivery Management
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              {tenantOrders.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full lifecycle fulfillment: GPS pin, payment slip inspection, Domex/Koombiyo dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportOrdersCSV}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            title="Download CSV formatted for Domex / PromptX / Koombiyo courier manifest"
          >
            <Download className="w-4 h-4" />
            Export Courier CSV
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Phone, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses ({tenantOrders.length})</option>
            {orderStatuses.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label} ({tenantOrders.filter((o) => o.orderStatus === st.value).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Orders Table (left) + Order Details Drawer (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Orders Table (7 cols or 12 if no selection) */}
        <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          {order.phone1}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-[170px] truncate">
                        <span className="font-medium text-slate-800">
                          {order.items[0]?.productName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {selectedTenant.currency} {order.grandTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            statusColors[order.orderStatus] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOrder(order);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">No matching orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details & Action Drawer (5 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-5 sticky top-20">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-base">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      statusColors[selectedOrder.orderStatus]
                    }`}
                  >
                    {selectedOrder.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Source: {selectedOrder.source.toUpperCase()} · {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Customer Contact & Links */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {selectedOrder.customerName}
                </span>
                <div className="flex items-center gap-1.5">
                  {/* WhatsApp Direct wa.me trigger */}
                  <a
                    href={`https://wa.me/${selectedOrder.phone1.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Open WhatsApp Web chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  {/* Call phone */}
                  <a
                    href={`tel:${selectedOrder.phone1}`}
                    className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Call Phone 1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="text-slate-600 space-y-0.5 text-[11px]">
                <div>
                  <span className="text-slate-400">Primary Phone:</span>{' '}
                  <span className="font-mono font-semibold">{selectedOrder.phone1}</span>
                </div>
                {selectedOrder.phone2 && (
                  <div>
                    <span className="text-slate-400">Alt Phone:</span>{' '}
                    <span className="font-mono">{selectedOrder.phone2}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Address:</span>{' '}
                  <span>{selectedOrder.address || 'Address pending from customer form'}</span>
                </div>
              </div>

              {/* Google Location (Section 9 of prompt) */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-semibold truncate max-w-[180px]">
                    {selectedOrder.city || 'GPS Location Pin'}
                  </span>
                </div>
                {selectedOrder.googleMapsUrl ? (
                  <a
                    href={selectedOrder.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
                  >
                    Open Google Map <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[10px]">No pin provided</span>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{selectedOrder.items[0]?.productName || 'Item'}:</span>
                <span className="font-mono">
                  {selectedTenant.currency} {selectedOrder.itemTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span>Islandwide Courier:</span>
                  {currentRole !== 'staff' && (
                    <button
                      type="button"
                      onClick={() => setEditingCourierCharge(!editingCourierCharge)}
                      className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      {editingCourierCharge ? 'Cancel' : 'Edit Rate'}
                    </button>
                  )}
                </div>
                <span className="font-mono">
                  {selectedOrder.courierCharge === 0 ? (
                    <span className="text-emerald-700 font-bold">Free (Rs. 0)</span>
                  ) : (
                    `${selectedTenant.currency} ${selectedOrder.courierCharge.toLocaleString()}`
                  )}
                </span>
              </div>

              {/* Inline Manual Courier Rate Form */}
              {editingCourierCharge && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-300 space-y-2 mt-1 mb-1">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                    <span>Manual Courier Charge (Optional)</span>
                    <button
                      type="button"
                      onClick={() => setManualCourierChargeInput(0)}
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      Set Free (0)
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={manualCourierChargeInput}
                      onChange={(e) => setManualCourierChargeInput(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-xs font-mono border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderCourierCharge(selectedOrder.id, manualCourierChargeInput);
                        setSelectedOrder((prev) =>
                          prev
                            ? {
                                ...prev,
                                courierCharge: manualCourierChargeInput,
                                grandTotal: prev.itemTotal + manualCourierChargeInput
                              }
                            : null
                        );
                        setEditingCourierCharge(false);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded cursor-pointer"
                    >
                      Apply Charge
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Grand Total:</span>
                <span className="text-emerald-700 font-mono">
                  {selectedTenant.currency} {selectedOrder.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Receipt Review (Section 10 of prompt) */}
            <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-purple-950">
                  <Receipt className="w-4 h-4 text-purple-700" />
                  <span>Payment Receipt Slip</span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              {selectedOrder.receiptUrl ? (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-purple-200">
                  <img
                    src={selectedOrder.receiptUrl}
                    alt="Receipt"
                    className="w-14 h-14 object-cover rounded-md border border-slate-200 cursor-pointer"
                    onClick={() => setReceiptModalOrder(selectedOrder)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[11px] text-slate-700 truncate">
                      Ref: {selectedOrder.paymentReference || 'N/A'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Uploaded: {selectedOrder.receiptUploadedAt ? new Date(selectedOrder.receiptUploadedAt).toLocaleTimeString() : 'Recent'}
                    </div>
                    <button
                      onClick={() => setReceiptModalOrder(selectedOrder)}
                      className="text-xs text-purple-700 hover:underline font-bold mt-1 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Inspect Slip
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-purple-700">
                  Customer has not uploaded a deposit slip yet.
                </p>
              )}

              {/* Quick Payment Action Buttons */}
              {currentRole !== 'staff' && (
                <div className="flex items-center gap-2 pt-1">
                  {selectedOrder.paymentStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => verifyPayment(selectedOrder.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                    >
                      Approve Payment
                    </button>
                  )}
                  {selectedOrder.paymentStatus !== 'REJECTED' && (
                    <button
                      onClick={() => {
                        rejectPayment(selectedOrder.id, 'Payment slip is blurred or transaction reference mismatch');
                      }}
                      className="py-1.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-semibold text-[11px] transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Courier Dispatch Section */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Courier Dispatch (Domex / Koombiyo)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={courierCompany}
                    onChange={(e) => setCourierCompany(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  >
                    <option value="Domex">Domex Courier</option>
                    <option value="PromptX">PromptX Courier</option>
                    <option value="Koombiyo">Koombiyo Delivery</option>
                    <option value="Citypak">Citypak SL</option>
                    <option value="Pronto">Pronto Lanka</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-1">
                    Waybill / Tracking #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DX-984210"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 rounded"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => sendWhatsAppTemplate('dispatched')}
                className="w-full py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                Mark as Shipped & Notify Customer via WhatsApp
              </button>
            </div>

            {/* Change Order Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Update Order Lifecycle Status
              </label>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {orderStatuses.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom WhatsApp Reply Box */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Send WhatsApp Update to Customer
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type custom message to send directly..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSendCustomWhatsApp}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
