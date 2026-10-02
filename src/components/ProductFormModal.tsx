import React, { useState, useEffect, useRef } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../types';
import { CATEGORIES } from '../mockData';
import {
  X,
  Upload,
  Sparkles,
  Share2,
  Video,
  Image as ImageIcon,
  Check,
  Plus,
  Trash2,
  Play,
  Film,
  Info,
  CheckCircle2,
  AlertCircle,
  Truck,
  Tag
} from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  initialOpenVideo?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  initialOpenVideo = false
}) => {
  const {
    addProduct,
    updateProduct,
    publishToFacebook,
    selectedTenant,
    categories,
    addCategory,
    showToast
  } = useCommerce();

  // Active section tab: 'details' | 'images' | 'video' | 'facebook'
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'video' | 'facebook'>('details');

  const [name, setName] = useState('Samsung Galaxy A15 5G (8GB/128GB)');
  const [nameError, setNameError] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_general');
  const [showManualCategory, setShowManualCategory] = useState(false);
  const [manualCategoryName, setManualCategoryName] = useState('');

  const [price, setPrice] = useState<number>(45000);
  const [discountPrice, setDiscountPrice] = useState<number>(43500);
  const [courierCharge, setCourierCharge] = useState<number>(selectedTenant.defaultCourierCharge || 450);
  const [stock, setStock] = useState<number>(15);
  const [description, setDescription] = useState('Brand new with 1 Year Company Warranty and TRCSL approval.');

  // Handle saving new manual category
  const handleSaveManualCategory = () => {
    if (!manualCategoryName.trim()) {
      showToast('Please enter a category name', 'warning');
      return;
    }
    const createdCat = addCategory(manualCategoryName.trim());
    setCategoryId(createdCat.id);
    setManualCategoryName('');
    setShowManualCategory(false);
    showToast(`Category "${createdCat.name}" added and selected!`);
  };

  // Images state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80'
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Optional Video State
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');

  const [facebookCaption, setFacebookCaption] = useState('');
  const [active, setActive] = useState(true);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Sample presets for images
  const samplePresets = [
    {
      title: 'Samsung Galaxy A15',
      url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Xiaomi Redmi 13C',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'T900 Smart Watch',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Wireless Earbuds',
      url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Silk Batik Dress',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // Sample video presets
  const sampleVideoPresets = [
    {
      title: 'Smartphone Hands-on MP4',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-modern-smartphone-with-green-screen-43285-large.mp4'
    },
    {
      title: 'Unboxing & Parcel Clip',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-opening-a-gift-box-41315-large.mp4'
    },
    {
      title: 'Delivery Rider Dispatch',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-delivery-man-riding-a-motorcycle-41138-large.mp4'
    }
  ];

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Reset or populate fields only when isOpen changes or editing a different product
  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategoryId(productToEdit.categoryId);
      setPrice(productToEdit.price);
      setDiscountPrice(productToEdit.discountPrice || productToEdit.price);
      setCourierCharge(productToEdit.courierCharge);
      setStock(productToEdit.stock);
      setDescription(productToEdit.description || '');
      setImages(productToEdit.images && productToEdit.images.length > 0 ? productToEdit.images : []);
      setVideoUrl(productToEdit.videoUrl || '');
      setShowVideoSection(Boolean(productToEdit.videoUrl) || initialOpenVideo);
      setFacebookCaption(productToEdit.facebookCaption || '');
      setActive(productToEdit.active);
      if (initialOpenVideo) {
        setActiveTab('video');
      } else {
        setActiveTab('details');
      }
    } else {
      setName('Samsung Galaxy A15 (8GB/128GB)');
      setSku('SAM-' + Math.floor(100 + Math.random() * 900));
      setCategoryId(CATEGORIES[0].id);
      setPrice(45000);
      setDiscountPrice(43500);
      setCourierCharge(selectedTenant.defaultCourierCharge || 450);
      setStock(15);
      setDescription('Brand new with 1 Year Warranty & TRCSL approval. Islandwide safe delivery.');
      setImages([
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80'
      ]);
      setVideoUrl('');
      setShowVideoSection(initialOpenVideo);
      setFacebookCaption(`🔥 Samsung Galaxy A15 (8GB/128GB) 🔥\nPrice: ${selectedTenant.currency} 45,000 + Islandwide Courier Rs. 450\nTap below to order via WhatsApp!`);
      setActive(true);
      if (initialOpenVideo) {
        setActiveTab('video');
      } else {
        setActiveTab('details');
      }
    }
    setNameError('');
    setCustomImageUrl('');
    setShowUrlInput(false);
    setVideoFileName('');
  }, [isOpen, productToEdit?.id, initialOpenVideo]);

  // Keyboard Escape listener
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

  const generateAutoCaption = () => {
    const total = price + courierCharge;
    const generated = `🔥 NEW ARRIVAL: ${name || 'Featured Item'} 🔥\n\n💰 Selling Price: ${selectedTenant.currency} ${price.toLocaleString()}\n🚚 Islandwide Courier Delivery: ${selectedTenant.currency} ${courierCharge}\n📦 Total Payable: ${selectedTenant.currency} ${total.toLocaleString()}\n\n✅ 100% Genuine Quality Guarantee\n✅ Islandwide safe delivery within 24-48 hours\n\n👇 Click "Send WhatsApp Message" below to order directly!`;
    setFacebookCaption(generated);
    showToast('Auto-generated Facebook & WhatsApp caption!');
  };

  // Image Upload Handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      showToast(`Attached ${files.length} photo(s)`);
    }
  };

  const handleAddCustomImageUrl = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
      setShowUrlInput(false);
      showToast('Image URL added');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Video Upload Handlers
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setVideoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      showToast(`Attached video file: ${file.name}`);
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    setVideoFileName('');
    setShowVideoSection(false);
    showToast('Video clip removed', 'info');
  };

  // Save handler with inline validation (NO window.alert!)
  const handleSave = (shareToFb: boolean) => {
    if (!name.trim()) {
      setNameError('Product name is required');
      setActiveTab('details');
      showToast('Please enter a product name to continue', 'warning');
      return;
    }

    setNameError('');
    let finalCategoryId = categoryId;
    let selectedCat = categories.find((c) => c.id === categoryId)?.name;

    if (showManualCategory && manualCategoryName.trim()) {
      const created = addCategory(manualCategoryName.trim());
      finalCategoryId = created.id;
      selectedCat = created.name;
    }

    if (!selectedCat) {
      selectedCat = 'General';
      finalCategoryId = 'cat_general';
    }

    if (productToEdit) {
      const updatedProduct: Product = {
        ...productToEdit,
        name: name.trim(),
        sku: sku.trim() || 'SKU-' + Date.now().toString().slice(-4),
        categoryId: finalCategoryId,
        categoryName: selectedCat,
        price: Number(price) || 0,
        discountPrice: Number(discountPrice) || Number(price) || 0,
        courierCharge: Number(courierCharge) || 0,
        stock: Number(stock) || 0,
        description: description.trim(),
        images,
        videoUrl: videoUrl.trim() || undefined,
        facebookCaption,
        active,
        updatedAt: new Date().toISOString()
      };
      updateProduct(updatedProduct);

      if (shareToFb) {
        if (Number(stock) <= 0) {
          showToast(
            `Product saved, but Facebook share was auto-blocked because stock is 0.`,
            'warning'
          );
        } else {
          publishToFacebook(updatedProduct.id, facebookCaption);
        }
      }
    } else {
      const created = addProduct({
        tenantId: selectedTenant.id,
        name: name.trim(),
        sku: sku.trim() || 'SKU-' + Date.now().toString().slice(-4),
        categoryId: finalCategoryId,
        categoryName: selectedCat,
        price: Number(price) || 0,
        discountPrice: Number(discountPrice) || Number(price) || 0,
        courierCharge: Number(courierCharge) || 0,
        stock: Number(stock) || 0,
        description: description.trim(),
        images,
        videoUrl: videoUrl.trim() || undefined,
        facebookCaption,
        active,
        facebookShared: false
      });

      if (shareToFb) {
        if (Number(stock) <= 0) {
          showToast(
            `Product created, but Facebook share was auto-blocked because stock is 0.`,
            'warning'
          );
        } else {
          publishToFacebook(created.id, facebookCaption);
        }
      }
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {selectedTenant.name} · Product Details, Optional Images & Video Clip
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/80 transition-all cursor-pointer flex items-center justify-center"
            title="Close dialog (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs (Makes all optional sections instantly accessible!) */}
        <div className="px-5 sm:px-6 pt-2 bg-slate-50/50 border-b border-slate-200 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. Basic Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'images'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Images ({images.length})</span>
            <span className="text-[9px] text-slate-400 font-normal">Optional</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowVideoSection(true);
              setActiveTab('video');
            }}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'video'
                ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            <span>3. Video Clip</span>
            {videoUrl && <span className="w-2 h-2 rounded-full bg-rose-500" />}
            <span className="text-[9px] text-slate-400 font-normal">Optional</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'facebook'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>4. Facebook Caption</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy A15 (8GB/128GB)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError('');
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none transition-all ${
                    nameError
                      ? 'border-rose-500 ring-2 ring-rose-200'
                      : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {nameError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {nameError}
                  </p>
                )}
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Code / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAM-A15"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Category</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                        Optional
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManualCategory(!showManualCategory)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{showManualCategory ? 'Choose Existing' : 'Manual Add'}</span>
                    </button>
                  </div>

                  {showManualCategory ? (
                    <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-300 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
                        <span>Enter Custom Category (Optional)</span>
                        <button
                          type="button"
                          onClick={() => setShowManualCategory(false)}
                          className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="e.g. Solar Power, Watches, Fashion..."
                          value={manualCategoryName}
                          onChange={(e) => setManualCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveManualCategory();
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500 font-sans"
                        />
                        <button
                          type="button"
                          onClick={handleSaveManualCategory}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer shrink-0"
                        >
                          Add & Select
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setShowManualCategory(true);
                        } else {
                          setCategoryId(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="cat_general">General / Default (Optional)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      <option value="__new__">+ Add Custom Category (Manual)...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Prices, Courier, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Selling Price ({selectedTenant.currency}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Courier Charge (Manual Add & Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-orange-600" />
                      <span>Courier Charge</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                        Optional
                      </span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="0 for Free Delivery"
                      value={courierCharge}
                      onChange={(e) => setCourierCharge(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Quick Preset Pills for Courier */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setCourierCharge(selectedTenant.defaultCourierCharge || 450)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold transition-colors cursor-pointer ${
                        courierCharge === selectedTenant.defaultCourierCharge
                          ? 'bg-orange-50 border-orange-300 text-orange-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Default ({selectedTenant.defaultCourierCharge})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourierCharge(0)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold transition-colors cursor-pointer ${
                        courierCharge === 0
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Free (0)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className={`w-full px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none ${
                      Number(stock) <= 0
                        ? 'border-rose-400 bg-rose-50/50 text-rose-900 font-bold focus:border-rose-500'
                        : 'border-slate-300 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Stock 0 Warning Notice */}
              {Number(stock) <= 0 && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2.5">
                  <span className="text-base shrink-0">🚫</span>
                  <div>
                    <span className="font-bold">Stock is 0 (Out of Stock):</span> Facebook sharing is <strong>automatically blocked</strong> for this item to prevent orders on out-of-stock items. Enter stock &gt; 0 to allow sharing.
                  </div>
                </div>
              )}

              {/* Customer Total Calculation */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-medium">
                  Customer Checkout Total (Selling Price + Courier Charge):
                </span>
                <span className="font-mono font-extrabold text-emerald-800 text-sm">
                  {selectedTenant.currency} {(price + courierCharge).toLocaleString()}{' '}
                  {courierCharge === 0 ? (
                    <span className="text-xs font-bold text-emerald-600 font-sans ml-1">(Free Delivery)</span>
                  ) : (
                    <span className="text-xs font-normal text-emerald-600 font-sans ml-1">
                      (Price: {price.toLocaleString()} + Courier: {courierCharge.toLocaleString()})
                    </span>
                  )}
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key specifications, warranty details (e.g. 1 Year Company Warranty), package contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              {/* Next Step Shortcut Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Step 1 of 4 completed
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next: Product Images</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: OPTIONAL IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Product Images Gallery ({images.length} photos)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Upload JPG, PNG, or WebP photos. The first image is used as the cover on Facebook & WhatsApp.
                    </p>
                  </div>

                  {/* ACTION BUTTON: + Upload Images */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={imageFileInputRef}
                      onChange={handleImageFileChange}
                      multiple
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Upload Images</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Direct URL input if toggled */}
                {showUrlInput && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Paste Image URL (https://...)"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomImageUrl}
                      className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Sample Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Quick Presets:</span>
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => {
                        setImages((prev) => [...prev, preset.url]);
                        showToast(`Added ${preset.title} image`);
                      }}
                      className="text-[10px] bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-md px-2 py-1 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      + {preset.title}
                    </button>
                  ))}
                </div>

                {/* Gallery of Uploaded Images */}
                <div className="pt-2">
                  {images.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 shadow-xs"
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-slate-950/80 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add more slot */}
                      <button
                        type="button"
                        onClick={() => imageFileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-700 transition-all cursor-pointer"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-[11px] font-bold">Add More</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-400">
                      No photos attached. Click "+ Upload Images" or choose a quick preset above.
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoSection(true);
                    setActiveTab('video');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next: Video Clip (Optional)</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OPTIONAL VIDEO CLIP */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-rose-500" />
                      <span>Product Video Clip</span>
                      <span className="text-[9px] font-normal text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                        Optional
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Attach product unboxing or demonstration video (MP4 or YouTube embed)
                    </p>
                  </div>

                  {/* ACTION BUTTON: + Add Video Clip */}
                  {!showVideoSection && !videoUrl ? (
                    <button
                      type="button"
                      onClick={() => setShowVideoSection(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>+ Add Video Clip</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Video
                    </button>
                  )}
                </div>

                {/* Video controls */}
                {(showVideoSection || videoUrl) && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileChange}
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => videoFileInputRef.current?.click()}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 text-rose-600" />
                        <span>Upload MP4 File</span>
                      </button>

                      <span className="text-[11px] text-slate-400 text-center sm:text-left">
                        or URL:
                      </span>

                      <input
                        type="text"
                        placeholder="Paste YouTube Embed or MP4 Video URL (https://...)"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {videoFileName && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> File attached: {videoFileName}
                      </div>
                    )}

                    {/* Sample Video Clips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">Try sample video clips:</span>
                      {sampleVideoPresets.map((vp) => (
                        <button
                          key={vp.title}
                          type="button"
                          onClick={() => {
                            setVideoUrl(vp.url);
                            showToast(`Loaded ${vp.title}`);
                          }}
                          className="text-[10px] bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-md px-2 py-1 text-slate-700 hover:text-rose-800 transition-colors cursor-pointer"
                        >
                          ▶ {vp.title}
                        </button>
                      ))}
                    </div>

                    {/* Live Video Player Preview */}
                    {videoUrl && (
                      <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 max-w-md mx-auto aspect-video relative shadow-sm">
                        {getYouTubeVideoId(videoUrl) ? (
                          <div className="w-full h-full relative group bg-black flex items-center justify-center">
                            <img
                              src={`https://img.youtube.com/vi/${getYouTubeVideoId(videoUrl)}/hqdefault.jpg`}
                              alt="YouTube Video Preview"
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 p-3 text-center">
                              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                                <Play className="w-6 h-6 fill-white translate-x-0.5" />
                              </div>
                              <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700">
                                YouTube Video Attached
                              </span>
                              <span className="text-[10px] text-slate-300 font-mono truncate max-w-xs">
                                Video ID: {getYouTubeVideoId(videoUrl)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <video
                            src={videoUrl}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Images
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('facebook')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next: Facebook Caption</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FACEBOOK CAPTION */}
          {activeTab === 'facebook' && (
            <div className="space-y-4">
              {Number(stock) <= 0 && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2.5">
                  <span className="text-base shrink-0">🚫</span>
                  <div>
                    <span className="font-bold">Facebook Sharing is Auto-Blocked:</span> This product currently has <strong>0 stock</strong>. Increase stock in Step 1 to allow publishing this promotional post to Facebook.
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span>Facebook & WhatsApp Ad Copy</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Promotional copy displayed on Facebook page and WhatsApp inquiries
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={generateAutoCaption}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Auto-Generate
                  </button>
                </div>

                <textarea
                  rows={5}
                  placeholder="Custom caption for Facebook post / WhatsApp advertisement..."
                  value={facebookCaption}
                  onChange={(e) => setFacebookCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Video
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Cancel</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Save Product</span>
            </button>
            {Number(stock) <= 0 ? (
              <button
                type="button"
                onClick={() => {
                  showToast(
                    '⛔ Facebook Sharing Auto-Blocked: Stock is 0! Product saved without sharing.',
                    'warning'
                  );
                  handleSave(false);
                }}
                title="Facebook sharing auto-blocked because stock is 0"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 text-slate-500 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:bg-slate-300"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Save (FB Share Blocked: Stock 0)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Save & Share to Facebook</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
