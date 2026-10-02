import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  Product,
  Order,
  OrderStatus,
  PaymentStatus,
  FacebookPost,
  WhatsAppMessage,
  UserRole,
  CourierDispatchInfo,
  Category
} from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_FACEBOOK_POSTS,
  INITIAL_MESSAGES,
  CATEGORIES
} from '../mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

interface CommerceContextType {
  // Tenancy & Roles
  tenants: Tenant[];
  selectedTenant: Tenant;
  setSelectedTenant: (tenant: Tenant) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
  updateTenant: (tenant: Tenant) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Categories (Manual and System)
  categories: Category[];
  addCategory: (name: string) => Category;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => void;
  toggleProductActive: (productId: string) => void;

  // Facebook Marketing
  facebookPosts: FacebookPost[];
  createFacebookPost: (post: Omit<FacebookPost, 'id' | 'metrics'>) => FacebookPost;
  publishToFacebook: (productId: string, caption?: string) => void;

  // Orders & Courier
  orders: Order[];
  createOrderFromCustomer: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderCourierCharge: (orderId: string, newCourierCharge: number) => void;
  verifyPayment: (orderId: string, notes?: string) => void;
  rejectPayment: (orderId: string, reason: string) => void;
  updateCourierInfo: (orderId: string, info: CourierDispatchInfo) => void;

  // WhatsApp
  messages: WhatsAppMessage[];
  sendWhatsAppMessage: (orderId: string, phone: string, customerName: string, text: string, type?: WhatsAppMessage['type']) => void;
  simulateCustomerInquiry: (productId: string, customerName: string, phone: string) => Order;

  // Customer Portal Mode & Modals
  customerModalOpen: boolean;
  setCustomerModalOpen: (open: boolean) => void;
  targetProductForCustomer: Product | null;
  setTargetProductForCustomer: (product: Product | null) => void;
  targetOrderForCustomer: Order | null;
  setTargetOrderForCustomer: (order: Order | null) => void;

  receiptModalOrder: Order | null;
  setReceiptModalOrder: (order: Order | null) => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;

  // Reset to seed data
  resetAllData: () => void;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('wcs_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [selectedTenant, setSelectedTenantState] = useState<Tenant>(() => {
    const savedId = localStorage.getItem('wcs_selected_tenant_id');
    const found = tenants.find((t: Tenant) => t.id === savedId);
    return found || tenants[0];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('business_owner');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wcs_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('wcs_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wcs_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>(() => {
    const saved = localStorage.getItem('wcs_facebook_posts');
    return saved ? JSON.parse(saved) : INITIAL_FACEBOOK_POSTS;
  });

  const [messages, setMessages] = useState<WhatsAppMessage[]>(() => {
    const saved = localStorage.getItem('wcs_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Modal / interactive targets
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [targetProductForCustomer, setTargetProductForCustomer] = useState<Product | null>(null);
  const [targetOrderForCustomer, setTargetOrderForCustomer] = useState<Order | null>(null);
  const [receiptModalOrder, setReceiptModalOrder] = useState<Order | null>(null);

  // Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Synchronize with localStorage
  useEffect(() => {
    localStorage.setItem('wcs_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('wcs_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wcs_selected_tenant_id', selectedTenant.id);
  }, [selectedTenant]);

  useEffect(() => {
    localStorage.setItem('wcs_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wcs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wcs_facebook_posts', JSON.stringify(facebookPosts));
  }, [facebookPosts]);

  useEffect(() => {
    localStorage.setItem('wcs_messages', JSON.stringify(messages));
  }, [messages]);

  const showToast = (message: string, type: ToastNotification['type'] = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setSelectedTenant = (tenant: Tenant) => {
    setSelectedTenantState(tenant);
    showToast(`Switched workspace to ${tenant.name}`, 'info');
  };

  const addTenant = (data: Omit<Tenant, 'id' | 'createdAt'>) => {
    const newTenant: Tenant = {
      ...data,
      id: 'tenant_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTenants((prev) => [...prev, newTenant]);
    setSelectedTenantState(newTenant);
    showToast(`New business "${newTenant.name}" registered successfully!`);
  };

  const updateTenant = (updated: Tenant) => {
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (selectedTenant.id === updated.id) {
      setSelectedTenantState(updated);
    }
    showToast('Business settings updated successfully');
  };

  // Category Actions (Manual & System)
  const addCategory = (name: string): Category => {
    const trimmed = name.trim();
    const existing = categories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      return existing;
    }
    const newCat: Category = {
      id: 'cat_' + Date.now(),
      name: trimmed
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`New category "${newCat.name}" added successfully!`);
    return newCat;
  };

  // Product Actions
  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const newProduct: Product = {
      ...data,
      id: 'prod_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added to catalog`);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    const isOutOfStock = Number(updated.stock) <= 0;
    const finalProduct: Product = {
      ...updated,
      // AUTO BLOCK: If stock <= 0, automatically unshare/block from Facebook
      facebookShared: isOutOfStock ? false : updated.facebookShared,
      updatedAt: new Date().toISOString()
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? finalProduct : p))
    );

    if (isOutOfStock && updated.facebookShared) {
      showToast(
        `⛔ Stock is 0: Facebook sharing for "${updated.name}" has been auto-blocked to prevent overselling!`,
        'warning'
      );
    } else {
      showToast(`Product "${updated.name}" updated`);
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'warning');
  };

  const duplicateProduct = (productId: string) => {
    const original = products.find((p) => p.id === productId);
    if (!original) return;
    const duplicated: Product = {
      ...original,
      id: 'prod_' + Date.now(),
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
      facebookShared: false,
      facebookSharedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated ${original.name}`);
  };

  const toggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  // Facebook Marketing
  const createFacebookPost = (data: Omit<FacebookPost, 'id' | 'metrics'>): FacebookPost => {
    const newPost: FacebookPost = {
      ...data,
      id: 'fb_post_' + Date.now(),
      metrics: {
        impressions: 1,
        reach: 1,
        clicks: 0,
        whatsappClicks: 0,
        ordersCount: 0
      }
    };
    setFacebookPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const publishToFacebook = (productId: string, customCaption?: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // AUTO BLOCK: If stock <= 0, strictly block Facebook sharing!
    if (Number(product.stock) <= 0) {
      showToast(
        `⛔ Sharing Auto-Blocked: "${product.name}" has 0 stock! Facebook share is blocked to prevent overselling.`,
        'warning'
      );
      return;
    }

    const caption =
      customCaption ||
      product.facebookCaption ||
      `🔥 ${product.name} 🔥\n\nPrice: ${selectedTenant.currency} ${product.price.toLocaleString()}\n🚚 Islandwide Courier: ${selectedTenant.currency} ${product.courierCharge}\n\nTap below to order via WhatsApp now!`;

    const newPost: FacebookPost = {
      id: 'fb_post_' + Date.now(),
      tenantId: selectedTenant.id,
      productId: product.id,
      productName: product.name,
      caption,
      mediaUrls: product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80'],
      mediaType: product.videoUrl ? 'video' : 'image',
      videoUrl: product.videoUrl,
      status: 'published',
      publishedAt: new Date().toISOString(),
      metrics: {
        impressions: 240,
        reach: 195,
        clicks: 14,
        whatsappClicks: 6,
        ordersCount: 1
      }
    };

    setFacebookPosts((prev) => [newPost, ...prev]);

    // Mark product as facebookShared
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              facebookShared: true,
              facebookSharedAt: new Date().toISOString(),
              facebookCaption: caption
            }
          : p
      )
    );

    showToast(`Published promotion to Facebook Page: "${selectedTenant.metaPageName}"!`);
  };

  // Orders
  const createOrderFromCustomer = (orderData: Partial<Order>): Order => {
    const nextOrderNumber =
      '#' + (10025 + orders.length + Math.floor(Math.random() * 5));
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      tenantId: selectedTenant.id,
      orderNumber: nextOrderNumber,
      customerId: 'cust_' + Date.now(),
      items: orderData.items || [],
      itemTotal: orderData.itemTotal || 0,
      courierCharge: orderData.courierCharge || selectedTenant.defaultCourierCharge,
      grandTotal: (orderData.itemTotal || 0) + (orderData.courierCharge || selectedTenant.defaultCourierCharge),
      customerName: orderData.customerName || 'Customer',
      address: orderData.address || '',
      city: orderData.city || '',
      district: orderData.district || 'Colombo',
      phone1: orderData.phone1 || '',
      phone2: orderData.phone2 || '',
      latitude: orderData.latitude,
      longitude: orderData.longitude,
      googleMapsUrl: orderData.googleMapsUrl,
      paymentStatus: (orderData.paymentStatus as PaymentStatus) || (orderData.receiptUrl ? 'RECEIPT_UPLOADED' : 'PENDING'),
      orderStatus: (orderData.orderStatus as OrderStatus) || (orderData.receiptUrl ? 'PAYMENT_RECEIVED' : 'CUSTOMER_DETAILS_RECEIVED'),
      receiptUrl: orderData.receiptUrl,
      receiptUploadedAt: orderData.receiptUrl ? now : undefined,
      paymentReference: orderData.paymentReference || '',
      source: orderData.source || 'facebook',
      facebookPostId: orderData.facebookPostId,
      courier: {},
      createdAt: now,
      updatedAt: now
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock for ordered items and auto-block Facebook sharing if stock reaches 0
    if (newOrder.items && newOrder.items.length > 0) {
      setProducts((prev) =>
        prev.map((p) => {
          const orderedItem = newOrder.items.find((it) => it.productId === p.id);
          if (orderedItem) {
            const updatedStock = Math.max(0, p.stock - (orderedItem.quantity || 1));
            const isNowOutOfStock = updatedStock <= 0;
            return {
              ...p,
              stock: updatedStock,
              // AUTO BLOCK: If stock becomes 0, automatically unshare/block from Facebook
              facebookShared: isNowOutOfStock ? false : p.facebookShared
            };
          }
          return p;
        })
      );
    }

    // Create an automatic inbound WhatsApp message log
    const welcomeMsg: WhatsAppMessage = {
      id: 'msg_' + Date.now(),
      tenantId: selectedTenant.id,
      orderId: newOrder.id,
      customerPhone: newOrder.phone1,
      customerName: newOrder.customerName,
      direction: 'inbound',
      type: newOrder.receiptUrl ? 'receipt' : 'text',
      content: newOrder.receiptUrl
        ? `[Order ${newOrder.orderNumber}] Customer completed delivery form and uploaded payment slip for Rs. ${newOrder.grandTotal.toLocaleString()}.`
        : `[Order ${newOrder.orderNumber}] Customer submitted delivery information: ${newOrder.address}`,
      timestamp: now,
      status: 'delivered'
    };
    setMessages((prev) => [welcomeMsg, ...prev]);

    showToast(`New Order ${newOrder.orderNumber} placed by ${newOrder.customerName}!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o
      )
    );
    showToast(`Order status updated to ${status.replace(/_/g, ' ')}`);
  };

  const updateOrderCourierCharge = (orderId: string, newCourierCharge: number) => {
    const charge = Math.max(0, Number(newCourierCharge) || 0);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newGrandTotal = o.itemTotal + charge;
          return {
            ...o,
            courierCharge: charge,
            grandTotal: newGrandTotal,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );
    showToast(`Order courier charge updated to ${selectedTenant.currency} ${charge}`);
  };

  const verifyPayment = (orderId: string, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus: 'VERIFIED',
            orderStatus: 'PAYMENT_VERIFIED',
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    const target = orders.find((o) => o.id === orderId);
    if (target) {
      // Send automated WhatsApp receipt confirmed message
      sendWhatsAppMessage(
        target.id,
        target.phone1,
        target.customerName,
        `✅ Payment Verified!\n\nHello ${target.customerName}, your payment of ${selectedTenant.currency} ${target.grandTotal.toLocaleString()} for order ${target.orderNumber} has been successfully verified. We are now preparing your parcel for courier dispatch!`,
        'template'
      );
    }

    showToast(`Payment for order verified! Automatic WhatsApp confirmation queued.`);
  };

  const rejectPayment = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'REJECTED',
              orderStatus: 'PAYMENT_REJECTED',
              paymentRejectionReason: reason,
              updatedAt: new Date().toISOString()
            }
          : o
      )
    );

    const target = orders.find((o) => o.id === orderId);
    if (target) {
      sendWhatsAppMessage(
        target.id,
        target.phone1,
        target.customerName,
        `⚠️ Payment Verification Issue\n\nDear ${target.customerName}, we could not verify your payment receipt for ${target.orderNumber}.\nReason: ${reason}\n\nPlease check the bank slip and re-upload or reply with a clear screenshot.`,
        'text'
      );
    }

    showToast(`Payment marked as rejected. WhatsApp update sent to customer.`, 'warning');
  };

  const updateCourierInfo = (orderId: string, info: CourierDispatchInfo) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const nextStatus: OrderStatus = info.trackingNumber ? 'SHIPPED' : 'READY_FOR_COURIER';
          return {
            ...o,
            courier: { ...o.courier, ...info },
            orderStatus: nextStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    const target = orders.find((o) => o.id === orderId);
    if (target && info.trackingNumber) {
      sendWhatsAppMessage(
        target.id,
        target.phone1,
        target.customerName,
        `📦 Order Shipped!\n\nHi ${target.customerName}, your order ${target.orderNumber} (${target.items[0]?.productName || 'Item'}) has been handed over to ${info.courierCompany || 'Courier'}.\n\nWaybill Tracking Number: ${info.trackingNumber}\nEstimated delivery: 1-2 business days. Thank you for shopping with ${selectedTenant.name}!`,
        'template'
      );
    }

    showToast(`Courier details saved and dispatch tracking notification created`);
  };

  const sendWhatsAppMessage = (
    orderId: string,
    phone: string,
    customerName: string,
    text: string,
    type: WhatsAppMessage['type'] = 'text'
  ) => {
    const newMsg: WhatsAppMessage = {
      id: 'msg_' + Date.now(),
      tenantId: selectedTenant.id,
      orderId,
      customerPhone: phone,
      customerName,
      direction: 'outbound',
      type,
      content: text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages((prev) => [newMsg, ...prev]);
    showToast(`WhatsApp sent to ${customerName} (${phone})`);
  };

  const simulateCustomerInquiry = (productId: string, customerName: string, phone: string): Order => {
    const product = products.find((p) => p.id === productId) || products[0];
    const orderNumber = '#' + (10026 + orders.length);
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      tenantId: selectedTenant.id,
      orderNumber,
      customerId: 'cust_' + Date.now(),
      items: [
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: 1,
          unitPrice: product.price,
          image: product.images[0] || ''
        }
      ],
      itemTotal: product.price,
      courierCharge: product.courierCharge || selectedTenant.defaultCourierCharge,
      grandTotal: product.price + (product.courierCharge || selectedTenant.defaultCourierCharge),
      customerName,
      address: '',
      phone1: phone,
      phone2: '',
      paymentStatus: 'PENDING',
      orderStatus: 'NEW',
      source: 'facebook',
      courier: {},
      createdAt: now,
      updatedAt: now
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Inbound customer message from FB
    const inMsg: WhatsAppMessage = {
      id: 'msg_' + Date.now(),
      tenantId: selectedTenant.id,
      orderId: newOrder.id,
      customerPhone: phone,
      customerName,
      direction: 'inbound',
      type: 'text',
      content: `Hello! I clicked your Facebook ad for ${product.name}. How can I purchase this with courier delivery?`,
      timestamp: now,
      status: 'delivered'
    };

    // Automated immediate bot reply with order form link
    const outMsg: WhatsAppMessage = {
      id: 'msg_' + (Date.now() + 500),
      tenantId: selectedTenant.id,
      orderId: newOrder.id,
      customerPhone: phone,
      customerName,
      direction: 'outbound',
      type: 'template',
      content: `Thank you for your purchase request for ${product.name}!\n\nItem Price: ${selectedTenant.currency} ${product.price.toLocaleString()}\nCourier Charge: ${selectedTenant.currency} ${product.courierCharge}\nTotal Amount: ${selectedTenant.currency} ${(product.price + product.courierCharge).toLocaleString()}\n\n👉 Tap here to fill your delivery details & upload bank receipt:\nhttps://order.apexmobile.lk/order/${newOrder.id}`,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      status: 'sent'
    };

    setMessages((prev) => [outMsg, inMsg, ...prev]);
    showToast(`New Facebook Lead captured! Created draft order ${newOrder.orderNumber}`);
    return newOrder;
  };

  const resetAllData = () => {
    localStorage.removeItem('wcs_tenants');
    localStorage.removeItem('wcs_selected_tenant_id');
    localStorage.removeItem('wcs_categories');
    localStorage.removeItem('wcs_products');
    localStorage.removeItem('wcs_orders');
    localStorage.removeItem('wcs_facebook_posts');
    localStorage.removeItem('wcs_messages');

    setTenants(INITIAL_TENANTS);
    setSelectedTenantState(INITIAL_TENANTS[0]);
    setCategories(CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setFacebookPosts(INITIAL_FACEBOOK_POSTS);
    setMessages(INITIAL_MESSAGES);

    showToast('Reset sample data to initial demonstration state', 'info');
  };

  return (
    <CommerceContext.Provider
      value={{
        tenants,
        selectedTenant,
        setSelectedTenant,
        addTenant,
        updateTenant,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        categories,
        addCategory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductActive,
        facebookPosts,
        createFacebookPost,
        publishToFacebook,
        orders,
        createOrderFromCustomer,
        updateOrderStatus,
        updateOrderCourierCharge,
        verifyPayment,
        rejectPayment,
        updateCourierInfo,
        messages,
        sendWhatsAppMessage,
        simulateCustomerInquiry,
        customerModalOpen,
        setCustomerModalOpen,
        targetProductForCustomer,
        setTargetProductForCustomer,
        targetOrderForCustomer,
        setTargetOrderForCustomer,
        receiptModalOrder,
        setReceiptModalOrder,
        toasts,
        showToast,
        removeToast,
        resetAllData
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
