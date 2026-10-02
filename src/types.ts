export type UserRole = 'super_admin' | 'business_owner' | 'staff';

export type OrderStatus =
  | 'NEW'
  | 'CUSTOMER_DETAILS_RECEIVED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_VERIFIED'
  | 'PROCESSING'
  | 'READY_FOR_COURIER'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'PAYMENT_REJECTED';

export type PaymentStatus = 'PENDING' | 'RECEIPT_UPLOADED' | 'VERIFIED' | 'REJECTED';

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  qrCodeUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  ownerName: string;
  ownerEmail: string;
  whatsappNumber: string;
  currency: string;
  defaultCourierCharge: number;
  bankDetails: BankAccountDetails;
  metaPageName: string;
  metaPageId: string;
  status: 'active' | 'suspended' | 'trial';
  plan: 'Starter' | 'Pro' | 'Enterprise';
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  discountPrice: number;
  courierCharge: number;
  stock: number;
  images: string[];
  videoUrl?: string;
  active: boolean;
  facebookShared: boolean;
  facebookSharedAt?: string;
  facebookCaption?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface CourierDispatchInfo {
  courierCompany?: string;
  trackingNumber?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  itemTotal: number;
  courierCharge: number;
  grandTotal: number;
  customerName: string;
  address: string;
  city?: string;
  district?: string;
  phone1: string;
  phone2: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  receiptUrl?: string;
  receiptUploadedAt?: string;
  paymentReference?: string;
  paymentRejectionReason?: string;
  source: 'facebook' | 'direct_whatsapp' | 'web';
  facebookPostId?: string;
  courier: CourierDispatchInfo;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  orderId?: string;
  customerPhone: string;
  customerName: string;
  direction: 'inbound' | 'outbound';
  type: 'text' | 'template' | 'receipt' | 'location';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface FacebookPost {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  caption: string;
  mediaUrls: string[];
  mediaType: 'image' | 'video';
  videoUrl?: string;
  status: 'published' | 'draft' | 'scheduled';
  publishedAt?: string;
  metrics: {
    impressions: number;
    reach: number;
    clicks: number;
    whatsappClicks: number;
    ordersCount: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}
