import React, { useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  Share2,
  Sparkles,
  Send,
  MessageCircle,
  Eye,
  CheckCircle,
  Smartphone,
  Monitor,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Share,
  Globe,
  MoreHorizontal
} from 'lucide-react';

export const FacebookComposer: React.FC = () => {
  const {
    products,
    selectedTenant,
    publishToFacebook,
    facebookPosts,
    setTargetProductForCustomer,
    setCustomerModalOpen
  } = useCommerce();

  const tenantProducts = products.filter((p) => p.tenantId === selectedTenant.id);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    tenantProducts[0]?.id || ''
  );

  const selectedProduct =
    tenantProducts.find((p) => p.id === selectedProductId) || tenantProducts[0];

  const [caption, setCaption] = useState<string>(
    selectedProduct?.facebookCaption ||
      `🔥 ${selectedProduct?.name || 'Exclusive Offer'} 🔥\n\nPrice: ${selectedTenant.currency} ${selectedProduct?.price.toLocaleString() || '0'}\n🚚 Islandwide Safe Courier Delivery (Rs. ${selectedProduct?.courierCharge || 450})\n\nTap below to order via WhatsApp directly!`
  );

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // When selected product changes, refresh caption
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = tenantProducts.find((p) => p.id === prodId);
    if (prod) {
      setCaption(
        prod.facebookCaption ||
          `🔥 ${prod.name} 🔥\n\nPrice: ${selectedTenant.currency} ${prod.price.toLocaleString()}\n🚚 Islandwide Courier Delivery: Rs. ${prod.courierCharge}\n\nTap "Send WhatsApp Message" below to order now!`
      );
    }
  };

  const handlePublish = () => {
    if (!selectedProduct) return;
    publishToFacebook(selectedProduct.id, caption);
  };

  const handleTestAdClick = () => {
    if (!selectedProduct) return;
    setTargetProductForCustomer(selectedProduct);
    setCustomerModalOpen(true);
  };

  const tenantPosts = facebookPosts.filter((p) => p.tenantId === selectedTenant.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Facebook Promotions & WhatsApp Ads
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Meta Graph API Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create high-converting social promotions with direct "Send WhatsApp Message" action triggers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestAdClick}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Test Customer Click (From Ad)
          </button>
        </div>
      </div>

      {/* Main Composer Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post Editor (5 cols) */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Post Configuration</h3>
            <span className="text-xs text-slate-400">Target Page: {selectedTenant.metaPageName}</span>
          </div>

          {/* Product Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Product to Promote
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            >
              {tenantProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {selectedTenant.currency} {p.price.toLocaleString()} ({p.stock} in stock)
                </option>
              ))}
            </select>
          </div>

          {/* Caption Composer */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Ad Caption / Facebook Text
              </label>
              <button
                type="button"
                onClick={() => {
                  if (selectedProduct) {
                    setCaption(
                      `🔥 MEGA PROMOTION: ${selectedProduct.name} 🔥\n\nOnly ${selectedTenant.currency} ${selectedProduct.price.toLocaleString()}!\n🚚 Islandwide Delivery to your doorstep (Rs. ${selectedProduct.courierCharge})\n🛡️ 100% Genuine with Warranty\n\n👇 Click "Send WhatsApp Message" below to order now!`
                    );
                  }
                }}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Optimize Copy
              </button>
            </div>
            <textarea
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-sans"
              placeholder="Write an enticing caption..."
            />
          </div>

          {/* Media Info */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Attached Media Assets
            </span>
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedProduct?.images[0] ||
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
                }
                alt="Product"
                className="w-16 h-16 rounded-lg object-cover border border-slate-300"
              />
              <div className="text-xs text-slate-600 space-y-0.5">
                <div className="font-semibold text-slate-800">
                  {selectedProduct?.name}
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Price: {selectedTenant.currency} {selectedProduct?.price.toLocaleString()}
                </div>
                <div className="text-emerald-700 font-medium text-[11px]">
                  WhatsApp CTA will link to: {selectedTenant.whatsappNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Publish to Facebook Page
            </button>
          </div>
        </div>

        {/* Right Column: Live Facebook Post Mockup (7 cols) */}
        <div className="lg:col-span-6 bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Facebook News Feed Preview
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded ${
                  previewDevice === 'mobile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded ${
                  previewDevice === 'desktop'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Realistic Facebook Card */}
          <div
            className={`bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all ${
              previewDevice === 'mobile' ? 'max-w-md w-full' : 'w-full'
            }`}
          >
            {/* Post Header */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedTenant.logoUrl}
                  alt={selectedTenant.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-slate-900 leading-tight">
                      {selectedTenant.metaPageName}
                    </span>
                    <span className="w-3.5 h-3.5 bg-blue-500 rounded-full text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>Sponsored</span>
                    <span>·</span>
                    <Globe className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>

              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </div>

            {/* Post Caption */}
            <div className="px-3.5 pb-3 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
              {caption}
            </div>

            {/* Product Image */}
            <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
              <img
                src={
                  selectedProduct?.images[0] ||
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80'
                }
                alt={selectedProduct?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Facebook Action Card Strip (WhatsApp CTA) */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  WHATSAPP.COM
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">
                  {selectedProduct?.name}
                </div>
                <div className="text-[11px] font-mono text-emerald-700 font-bold">
                  {selectedTenant.currency} {selectedProduct?.price.toLocaleString()}{' '}
                  <span className="text-slate-400 font-normal font-sans">
                    + Rs. {selectedProduct?.courierCharge} courier
                  </span>
                </div>
              </div>

              {/* High-Impact WhatsApp Button */}
              <button
                type="button"
                onClick={handleTestAdClick}
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-lg font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
                title="Simulates customer clicking WhatsApp CTA"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send WhatsApp</span>
              </button>
            </div>

            {/* Engagement Metrics (Like, Comment, Share) */}
            <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  👍
                </span>
                <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                  ❤️
                </span>
                <span className="text-[11px] text-slate-600 font-mono">1.4K</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>284 Comments</span>
                <span>95 Shares</span>
              </div>
            </div>

            {/* Interactive Bottom Bar */}
            <div className="px-2 py-1.5 border-t border-slate-200 grid grid-cols-3 text-center text-xs font-semibold text-slate-600">
              <button className="py-1.5 hover:bg-slate-50 rounded flex items-center justify-center gap-1.5">
                <ThumbsUp className="w-4 h-4" /> Like
              </button>
              <button className="py-1.5 hover:bg-slate-50 rounded flex items-center justify-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Comment
              </button>
              <button className="py-1.5 hover:bg-slate-50 rounded flex items-center justify-center gap-1.5">
                <Share className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Facebook Promotions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h3 className="font-bold text-base text-slate-900">
            Active Facebook Campaigns & WhatsApp Lead Generation
          </h3>
          <p className="text-xs text-slate-500">
            Real-time analytics recorded from Meta Ads Manager & WhatsApp Webhook endpoints
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Post & Product</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4">FB Reach</th>
                <th className="py-3 px-4">Link Clicks</th>
                <th className="py-3 px-4">WhatsApp Inquiries</th>
                <th className="py-3 px-4">Orders Converted</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tenantPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 max-w-[240px] truncate">
                    {post.productName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : 'Draft'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {post.metrics.reach.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {post.metrics.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                    {post.metrics.whatsappClicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {post.metrics.ordersCount} Orders
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={handleTestAdClick}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      Test Flow
                    </button>
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
