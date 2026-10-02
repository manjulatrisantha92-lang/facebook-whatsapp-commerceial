import React from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Receipt,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
  MessageCircle,
  ExternalLink,
  MapPin,
  Plus
} from 'lucide-react';
import { OrderStatus } from '../types';

export const DashboardView: React.FC<{
  onOpenAddProduct: () => void;
  onOpenOrder: (orderId: string) => void;
}> = ({ onOpenAddProduct, onOpenOrder }) => {
  const {
    orders,
    products,
    selectedTenant,
    setActiveTab,
    setCustomerModalOpen,
    setReceiptModalOrder
  } = useCommerce();

  // Filter orders by tenant
  const tenantOrders = orders.filter((o) => o.tenantId === selectedTenant.id);

  // Metrics
  const totalRevenue = tenantOrders
    .filter((o) => ['PAYMENT_VERIFIED', 'PROCESSING', 'READY_FOR_COURIER', 'SHIPPED', 'DELIVERED'].includes(o.orderStatus))
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const newOrders = tenantOrders.filter((o) => o.orderStatus === 'NEW').length;
  const pendingPayment = tenantOrders.filter((o) => ['PAYMENT_PENDING', 'CUSTOMER_DETAILS_RECEIVED'].includes(o.orderStatus)).length;
  const pendingSlipVerification = tenantOrders.filter((o) => o.orderStatus === 'PAYMENT_RECEIVED' || o.paymentStatus === 'RECEIPT_UPLOADED').length;
  const processing = tenantOrders.filter((o) => ['PROCESSING', 'READY_FOR_COURIER'].includes(o.orderStatus)).length;
  const delivered = tenantOrders.filter((o) => o.orderStatus === 'DELIVERED').length;

  const statusColors: Record<OrderStatus, string> = {
    NEW: 'bg-blue-500/10 text-blue-700 border-blue-200',
    CUSTOMER_DETAILS_RECEIVED: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    PAYMENT_PENDING: 'bg-amber-500/10 text-amber-700 border-amber-200',
    PAYMENT_RECEIVED: 'bg-purple-500/10 text-purple-700 border-purple-200 font-bold animate-pulse',
    PAYMENT_VERIFIED: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    PROCESSING: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    READY_FOR_COURIER: 'bg-orange-500/10 text-orange-700 border-orange-200',
    SHIPPED: 'bg-teal-500/10 text-teal-700 border-teal-200',
    DELIVERED: 'bg-emerald-600/10 text-emerald-800 border-emerald-300 font-bold',
    CANCELLED: 'bg-slate-500/10 text-slate-700 border-slate-200',
    RETURNED: 'bg-rose-500/10 text-rose-700 border-rose-200',
    PAYMENT_REJECTED: 'bg-red-500/10 text-red-700 border-red-200'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {selectedTenant.name}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              Live Operations
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Facebook-to-WhatsApp social order fulfillment center · Sri Lanka (LKR)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            Publish FB Promotion
          </button>
          <button
            onClick={() => setCustomerModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Simulate Customer Order
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Sales */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verified Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {selectedTenant.currency} {totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>● 100% bank verified sales</span>
          </p>
        </div>

        {/* New Orders */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>New Leads (FB)</span>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {newOrders}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pending customer details</p>
        </div>

        {/* Pending Slips */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verify Receipts</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-purple-700 tracking-tight font-mono flex items-center gap-2">
            {pendingSlipVerification}
            {pendingSlipVerification > 0 && (
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
                Action required
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Uploaded bank slips</p>
        </div>

        {/* Processing / Ready */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Ready for Courier</span>
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {processing}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Packing & Domex dispatch</p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Delivered Parcels</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
            {delivered}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Completed orders</p>
        </div>
      </div>

      {/* Social Commerce Conversion Funnel */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-750">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-white">
              <span>Facebook to WhatsApp Conversion Funnel</span>
              <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Automated Bot Flow
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking customer journey from Facebook Post impression to verified payment delivery
            </p>
          </div>
          <button
            onClick={() => setActiveTab('facebook')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            View Facebook Ads & Metrics <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block font-medium">Step 1: FB Ad Impressions</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1 block">
              23,750
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Sri Lankan audience</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 relative">
            <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-between">
              <span>Step 2: WhatsApp Clicks</span>
              <span className="font-mono text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-300">
                2.2% CTR
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
              540
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Customer conversations</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-amber-300 block font-medium">Step 3: Details & GPS Shared</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono mt-1 block">
              {tenantOrders.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Completed delivery forms</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-cyan-300 block font-medium">Step 4: Slips Uploaded & Paid</span>
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono mt-1 block">
              {tenantOrders.filter((o) => o.paymentStatus === 'VERIFIED').length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Fully verified payments</span>
          </div>
        </div>
      </div>

      {/* Pending Receipts Alert Box (if any) */}
      {pendingSlipVerification > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-950">
                {pendingSlipVerification} Customer Payment Receipts Awaiting Verification
              </h4>
              <p className="text-xs text-purple-700">
                Customers have uploaded Commercial Bank / Sampath Bank payment deposit slips. Review and approve to proceed with packing.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('payments')}
            className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            Review Slips Now
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent WhatsApp & Facebook Orders</h3>
            <p className="text-xs text-slate-500">
              Live incoming customer orders with Google Location and payment slips
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            View All ({tenantOrders.length}) Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer & WhatsApp</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tenantOrders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
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
                  <td className="py-3 px-4 max-w-[200px] truncate">
                    <span className="font-medium text-slate-800">
                      {order.items[0]?.productName || 'Product'}
                    </span>
                    {order.items.length > 1 && (
                      <span className="text-[10px] text-slate-400 ml-1">
                        +{order.items.length - 1} more
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {selectedTenant.currency} {order.grandTotal.toLocaleString()}
                    <div className="text-[10px] text-slate-400 font-sans font-normal">
                      Incl. Rs. {order.courierCharge} courier
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {order.googleMapsUrl ? (
                      <a
                        href={order.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline"
                        title="Open customer GPS location on Google Maps"
                      >
                        <MapPin className="w-3 h-3 text-red-500" />
                        {order.city || 'GPS Location'}
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No GPS pinned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        statusColors[order.orderStatus] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.receiptUrl && order.paymentStatus === 'RECEIPT_UPLOADED' && (
                        <button
                          onClick={() => setReceiptModalOrder(order)}
                          className="px-2 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold rounded text-[11px] cursor-pointer"
                        >
                          Verify Slip
                        </button>
                      )}
                      <button
                        onClick={() => onOpenOrder(order.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
