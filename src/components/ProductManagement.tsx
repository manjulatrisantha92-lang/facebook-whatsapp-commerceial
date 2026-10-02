import React, { useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../types';
import { CATEGORIES } from '../mockData';
import {
  Package,
  Plus,
  Search,
  Share2,
  Copy,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Filter,
  Play,
  Film,
  X
} from 'lucide-react';

interface ProductManagementProps {
  onOpenAddModal: (openVideo?: boolean) => void;
  onEditProduct: (product: Product, openVideo?: boolean) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  onOpenAddModal,
  onEditProduct
}) => {
  const {
    products,
    categories,
    selectedTenant,
    duplicateProduct,
    deleteProduct,
    toggleProductActive,
    publishToFacebook,
    setTargetProductForCustomer,
    setCustomerModalOpen,
    setActiveTab,
    currentRole,
    showToast
  } = useCommerce();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [fbFilter, setFbFilter] = useState<'all' | 'shared' | 'not_shared'>('all');

  // Video Preview Lightbox State
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const tenantProducts = products.filter((p) => p.tenantId === selectedTenant.id);

  const filteredProducts = tenantProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.active) ||
      (statusFilter === 'inactive' && !product.active);
    const matchesFb =
      fbFilter === 'all' ||
      (fbFilter === 'shared' && product.facebookShared) ||
      (fbFilter === 'not_shared' && !product.facebookShared);

    return matchesSearch && matchesCategory && matchesStatus && matchesFb;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Product Catalog & Inventory
            </h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-md">
              {tenantProducts.length} Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage pricing, multiple product images, optional video demonstration clips, and Facebook status
          </p>
        </div>

        {currentRole !== 'staff' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddModal(true)}
              className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              title="Add product with video clip panel open"
            >
              <Film className="w-4 h-4 text-rose-600" />
              <span>+ Add Video Product</span>
            </button>
            <button
              onClick={() => onOpenAddModal(false)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, model, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Facebook filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Facebook:</span>
          <select
            value={fbFilter}
            onChange={(e) => setFbFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All FB Status</option>
            <option value="shared">Shared to Facebook</option>
            <option value="not_shared">Not Shared</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Media Assets</th>
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Courier</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Facebook</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 5;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Media Assets Column with Optional Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          {product.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white font-mono text-[9px] px-1 rounded-tl">
                              +{product.images.length - 1}
                            </span>
                          )}
                        </div>

                        {/* Optional action triggers for media */}
                        <div className="flex flex-col gap-1">
                          {product.videoUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewVideoUrl(product.videoUrl!)}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 transition-colors cursor-pointer"
                              title="Play Video Demonstration"
                            >
                              <Play className="w-2.5 h-2.5 fill-rose-600" />
                              <span>Play Clip</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onEditProduct(product, true)}
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 px-2 py-0.5 rounded-md border border-dashed border-slate-300 hover:border-rose-300 transition-colors cursor-pointer"
                              title="Add optional video clip to this product"
                            >
                              <Video className="w-2.5 h-2.5 text-rose-500" />
                              <span>+ Video</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onEditProduct(product, false)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 rounded-md border border-dashed border-slate-300 hover:border-emerald-300 transition-colors cursor-pointer"
                            title="Add or manage images"
                          >
                            <ImageIcon className="w-2.5 h-2.5 text-emerald-600" />
                            <span>+ Photos</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Product Name & SKU */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-bold text-slate-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        SKU: {product.sku}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {product.categoryName}
                      </span>
                    </td>

                    {/* Price & Courier */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {selectedTenant.currency} {product.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        + Courier: {selectedTenant.currency} {product.courierCharge}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    {/* Facebook Share Status */}
                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <div
                          title="Facebook sharing auto-blocked because stock is 0"
                          className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-bold text-[10px]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          <span>🚫 Blocked (Stock 0)</span>
                        </div>
                      ) : product.facebookShared ? (
                        <div className="flex items-center gap-1.5 text-blue-700 font-medium text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span>Published</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span>Draft only</span>
                        </div>
                      )}
                    </td>

                    {/* Active/Inactive */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductActive(product.id)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          product.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Customer Test Link */}
                        <button
                          onClick={() => {
                            setTargetProductForCustomer(product);
                            setCustomerModalOpen(true);
                          }}
                          title="Simulate ordering this product as a customer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Share to Facebook (Auto-Blocked if Stock is 0) */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isOutOfStock) {
                              showToast(
                                `⛔ Facebook Share Blocked: "${product.name}" has 0 stock! Replenish stock to enable sharing.`,
                                'warning'
                              );
                              return;
                            }
                            publishToFacebook(product.id);
                          }}
                          title={
                            isOutOfStock
                              ? 'Facebook sharing auto-blocked: Stock is 0!'
                              : 'Publish/Share to Facebook Page'
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            isOutOfStock
                              ? 'text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-not-allowed'
                              : 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        {currentRole !== 'staff' && (
                          <button
                            onClick={() => onEditProduct(product, false)}
                            title="Edit Product Details"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          title="Duplicate Product"
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        {currentRole === 'business_owner' && (
                          <button
                            onClick={() => {
                              deleteProduct(product.id);
                            }}
                            title="Delete Product"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">No products found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search query or add a new product to your inventory
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
            <div className="p-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-sm">Product Video Preview</span>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                <div className="w-full h-full relative group bg-black flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${
                      previewVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1] || 'default'
                    }/hqdefault.jpg`}
                    alt="YouTube Video Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 p-3 text-center">
                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700">
                      YouTube Video Linked
                    </span>
                  </div>
                </div>
              ) : (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
