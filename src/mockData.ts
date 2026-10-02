import { Tenant, Product, Order, Category, FacebookPost, WhatsAppMessage } from './types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant_apex',
    name: 'Apex Mobile Solutions',
    slug: 'apex-mobile',
    logoUrl: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=150&auto=format&fit=crop&q=80',
    ownerName: 'Sunil Dissanayake',
    ownerEmail: 'sunil@apexmobile.lk',
    whatsappNumber: '+94 77 123 4567',
    currency: 'Rs.',
    defaultCourierCharge: 450,
    bankDetails: {
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '8004592019',
      accountName: 'Apex Mobile Solutions (Pvt) Ltd',
      branch: 'Kollupitiya Branch (042)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=COMMERCIAL_BANK_8004592019_APEX_MOBILE'
    },
    metaPageName: 'Apex Mobile Colombo - Official',
    metaPageId: 'fb_apex_colombo_2026',
    status: 'active',
    plan: 'Enterprise',
    createdAt: '2026-01-15'
  },
  {
    id: 'tenant_fashion',
    name: 'Ceylon Silk & Attire',
    slug: 'ceylon-silk',
    logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop&q=80',
    ownerName: 'Manel Gunaratne',
    ownerEmail: 'manel@ceylonsilk.lk',
    whatsappNumber: '+94 71 889 9000',
    currency: 'Rs.',
    defaultCourierCharge: 400,
    bankDetails: {
      bankName: 'Sampath Bank PLC',
      accountNumber: '109230048123',
      accountName: 'Ceylon Silk & Attire',
      branch: 'Bambalapitiya Branch',
    },
    metaPageName: 'Ceylon Silk & Attire LK',
    metaPageId: 'fb_ceylon_silk_lk',
    status: 'active',
    plan: 'Pro',
    createdAt: '2026-02-10'
  },
  {
    id: 'tenant_electro',
    name: 'ElectroHub Kandy',
    slug: 'electrohub-kandy',
    logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80',
    ownerName: 'Kavinda Bandara',
    ownerEmail: 'info@electrohub.lk',
    whatsappNumber: '+94 81 223 3445',
    currency: 'Rs.',
    defaultCourierCharge: 500,
    bankDetails: {
      bankName: 'Bank of Ceylon (BOC)',
      accountNumber: '70234918',
      accountName: 'ElectroHub Trading',
      branch: 'Kandy City Centre',
    },
    metaPageName: 'ElectroHub Sri Lanka',
    metaPageId: 'fb_electrohub_kandy',
    status: 'active',
    plan: 'Starter',
    createdAt: '2026-03-01'
  }
];

export const CATEGORIES: Category[] = [
  { id: 'cat_mobiles', name: 'Smartphones & Tablets' },
  { id: 'cat_audio', name: 'Earbuds & Audio' },
  { id: 'cat_wearables', name: 'Smart Watches & Bands' },
  { id: 'cat_accessories', name: 'Chargers & Power Banks' },
  { id: 'cat_fashion', name: 'Fashion & Wear' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_sam_a15',
    tenantId: 'tenant_apex',
    name: 'Samsung Galaxy A15 (8GB RAM / 128GB)',
    sku: 'SAM-A15-BLK',
    categoryId: 'cat_mobiles',
    categoryName: 'Smartphones & Tablets',
    description: 'Samsung Galaxy A15 5G features 6.5-inch 90Hz Super AMOLED display, 50MP triple camera, 5000mAh battery with 25W super fast charging. Brand new TRCSL approved with 1 Year Company Warranty.',
    price: 45000,
    discountPrice: 43500,
    courierCharge: 450,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-modern-smartphone-with-green-screen-43285-large.mp4',
    active: true,
    facebookShared: true,
    facebookSharedAt: '2026-09-28T09:30:00Z',
    facebookCaption: `🔥 MEGA SALE: Samsung Galaxy A15 (8GB/128GB) 🔥\n\nPrice: Rs. 45,000 only!\n🚚 Islandwide Safe Courier Delivery (Rs. 450)\n🛡️ 1 Year Company Warranty + TRCSL Approved\n\nTap below to order via WhatsApp directly!`,
    createdAt: '2026-09-20',
    updatedAt: '2026-09-28'
  },
  {
    id: 'prod_redmi_13',
    tenantId: 'tenant_apex',
    name: 'Xiaomi Redmi 13C (8GB RAM / 256GB)',
    sku: 'RED-13C-BLU',
    categoryId: 'cat_mobiles',
    categoryName: 'Smartphones & Tablets',
    description: 'Smooth 6.74" 90Hz display, 50MP AI triple camera setup, MediaTek Helio G85 octa-core processor, 5000mAh battery with 18W charging. Official Genxt / Xiaomi Sri Lanka warranty.',
    price: 38900,
    discountPrice: 37500,
    courierCharge: 450,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80'
    ],
    active: true,
    facebookShared: true,
    facebookSharedAt: '2026-09-29T11:15:00Z',
    facebookCaption: `📱 Xiaomi Redmi 13C 256GB Storage Edition!\n\nUnbeatable Price: Rs. 38,900\nFast Islandwide Delivery within 24-48 Hours.\nClick the WhatsApp button below to place your order!`,
    createdAt: '2026-09-22',
    updatedAt: '2026-09-29'
  },
  {
    id: 'prod_t900_watch',
    tenantId: 'tenant_apex',
    name: 'T900 Ultra 2 Max Smartwatch (Dual Straps)',
    sku: 'WCH-T900-OR',
    categoryId: 'cat_wearables',
    categoryName: 'Smart Watches & Bands',
    description: '2.09-inch HD infinite display, Bluetooth calling with high-clarity speaker, heart rate, SPO2 & sleep tracking, waterproof IP67, wireless magnetic charging cradle included.',
    price: 8500,
    discountPrice: 7990,
    courierCharge: 400,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80'
    ],
    active: true,
    facebookShared: false,
    facebookCaption: `⚡ T900 Ultra Smartwatch with Bluetooth Calling!\n\nJust Rs. 8,500 + Islandwide Courier Rs. 400.\nFree Extra Silicone Strap! Click to buy now.`,
    createdAt: '2026-09-25',
    updatedAt: '2026-09-25'
  },
  {
    id: 'prod_anker_r50i',
    tenantId: 'tenant_apex',
    name: 'Soundcore by Anker R50i True Wireless Earbuds',
    sku: 'ANK-R50I-WHT',
    categoryId: 'cat_audio',
    categoryName: 'Earbuds & Audio',
    description: '10mm drivers with extra bass EQ, 30 hours total playtime, 2-mic AI clear call technology, IPX5 water resistance, ultra-lightweight ergonomic fit.',
    price: 6950,
    discountPrice: 6500,
    courierCharge: 350,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80'
    ],
    active: true,
    facebookShared: true,
    facebookSharedAt: '2026-09-27T15:00:00Z',
    facebookCaption: `🎵 Original Soundcore R50i Wireless Earbuds\n\nRs. 6,950 only | 18 Months Warranty!\nOrder now through WhatsApp for same-day dispatch.`,
    createdAt: '2026-09-24',
    updatedAt: '2026-09-27'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_10025',
    tenantId: 'tenant_apex',
    orderNumber: '#10025',
    customerId: 'cust_kasun',
    items: [
      {
        productId: 'prod_sam_a15',
        productName: 'Samsung Galaxy A15 (8GB/128GB)',
        sku: 'SAM-A15-BLK',
        quantity: 1,
        unitPrice: 45000,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80'
      }
    ],
    itemTotal: 45000,
    courierCharge: 450,
    grandTotal: 45450,
    customerName: 'Kasun Perera',
    address: 'No. 42/B, 3rd Lane, Galle Road, Bambalapitiya',
    city: 'Colombo 04',
    district: 'Colombo',
    phone1: '+94 77 821 9920',
    phone2: '+94 11 258 4401',
    latitude: 6.8928,
    longitude: 79.8559,
    googleMapsUrl: 'https://maps.google.com/?q=6.8928,79.8559',
    paymentStatus: 'RECEIPT_UPLOADED',
    orderStatus: 'PAYMENT_RECEIVED',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    receiptUploadedAt: '2026-09-30T10:15:00',
    paymentReference: 'COMB-FT-9941829',
    source: 'facebook',
    facebookPostId: 'fb_post_001',
    courier: {
      courierCompany: 'Domex',
      notes: 'Customer requested delivery before 5 PM.'
    },
    createdAt: '2026-09-30T09:45:00',
    updatedAt: '2026-09-30T10:15:00'
  },
  {
    id: 'ord_10024',
    tenantId: 'tenant_apex',
    orderNumber: '#10024',
    customerId: 'cust_nimal',
    items: [
      {
        productId: 'prod_redmi_13',
        productName: 'Xiaomi Redmi 13C (8GB/256GB)',
        sku: 'RED-13C-BLU',
        quantity: 1,
        unitPrice: 38900,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
      }
    ],
    itemTotal: 38900,
    courierCharge: 450,
    grandTotal: 39350,
    customerName: 'Nimal Jayawardena',
    address: '15/3, Temple Road, Maharagama',
    city: 'Maharagama',
    district: 'Colombo',
    phone1: '+94 71 445 2219',
    phone2: '+94 77 110 3349',
    latitude: 6.8485,
    longitude: 79.9267,
    googleMapsUrl: 'https://maps.google.com/?q=6.8485,79.9267',
    paymentStatus: 'VERIFIED',
    orderStatus: 'PROCESSING',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    receiptUploadedAt: '2026-09-29T16:20:00',
    paymentReference: 'SAMPATH-TRX-81203',
    source: 'facebook',
    facebookPostId: 'fb_post_002',
    courier: {
      courierCompany: 'PromptX Courier',
      trackingNumber: '',
      notes: 'Fragile mobile box packaging'
    },
    createdAt: '2026-09-29T15:30:00',
    updatedAt: '2026-09-30T08:30:00'
  },
  {
    id: 'ord_10023',
    tenantId: 'tenant_apex',
    orderNumber: '#10023',
    customerId: 'cust_amal',
    items: [
      {
        productId: 'prod_t900_watch',
        productName: 'T900 Ultra 2 Max Smartwatch',
        sku: 'WCH-T900-OR',
        quantity: 1,
        unitPrice: 8500,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'
      }
    ],
    itemTotal: 8500,
    courierCharge: 400,
    grandTotal: 8900,
    customerName: 'Amal Senanayake',
    address: 'Awaiting delivery form details',
    city: 'Kandy',
    district: 'Kandy',
    phone1: '+94 76 991 3344',
    phone2: '',
    paymentStatus: 'PENDING',
    orderStatus: 'NEW',
    source: 'facebook',
    facebookPostId: 'fb_post_001',
    courier: {},
    createdAt: '2026-09-30T10:02:00',
    updatedAt: '2026-09-30T10:02:00'
  },
  {
    id: 'ord_10022',
    tenantId: 'tenant_apex',
    orderNumber: '#10022',
    customerId: 'cust_dinithi',
    items: [
      {
        productId: 'prod_sam_a15',
        productName: 'Samsung Galaxy A15 (8GB/128GB)',
        sku: 'SAM-A15-BLK',
        quantity: 1,
        unitPrice: 45000,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80'
      }
    ],
    itemTotal: 45000,
    courierCharge: 450,
    grandTotal: 45450,
    customerName: 'Dinithi Fernando',
    address: '88/1, Beach Road, Mount Lavinia',
    city: 'Mount Lavinia',
    district: 'Colombo',
    phone1: '+94 72 334 1120',
    phone2: '+94 77 900 1211',
    latitude: 6.8388,
    longitude: 79.8654,
    googleMapsUrl: 'https://maps.google.com/?q=6.8388,79.8654',
    paymentStatus: 'VERIFIED',
    orderStatus: 'READY_FOR_COURIER',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    receiptUploadedAt: '2026-09-29T11:00:00',
    paymentReference: 'BOC-PAY-77192',
    source: 'direct_whatsapp',
    courier: {
      courierCompany: 'Domex',
      trackingNumber: 'DX-892140',
      dispatchedAt: ''
    },
    createdAt: '2026-09-29T10:10:00',
    updatedAt: '2026-09-29T14:40:00'
  },
  {
    id: 'ord_10021',
    tenantId: 'tenant_apex',
    orderNumber: '#10021',
    customerId: 'cust_chathura',
    items: [
      {
        productId: 'prod_anker_r50i',
        productName: 'Soundcore by Anker R50i',
        sku: 'ANK-R50I-WHT',
        quantity: 2,
        unitPrice: 6950,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80'
      }
    ],
    itemTotal: 13900,
    courierCharge: 350,
    grandTotal: 14250,
    customerName: 'Chathura Wickramasinghe',
    address: '22, Main Street, Kurunegala',
    city: 'Kurunegala',
    district: 'Kurunegala',
    phone1: '+94 77 554 9988',
    phone2: '+94 37 222 8190',
    latitude: 7.4863,
    longitude: 80.3623,
    googleMapsUrl: 'https://maps.google.com/?q=7.4863,80.3623',
    paymentStatus: 'VERIFIED',
    orderStatus: 'SHIPPED',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    paymentReference: 'HNB-ONL-109284',
    source: 'facebook',
    courier: {
      courierCompany: 'Koombiyo Delivery',
      trackingNumber: 'KB-559124',
      dispatchedAt: '2026-09-29T14:00:00'
    },
    createdAt: '2026-09-28T16:00:00',
    updatedAt: '2026-09-29T14:00:00'
  },
  {
    id: 'ord_10020',
    tenantId: 'tenant_apex',
    orderNumber: '#10020',
    customerId: 'cust_ruvini',
    items: [
      {
        productId: 'prod_sam_a15',
        productName: 'Samsung Galaxy A15 (8GB/128GB)',
        sku: 'SAM-A15-BLK',
        quantity: 1,
        unitPrice: 45000,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80'
      }
    ],
    itemTotal: 45000,
    courierCharge: 450,
    grandTotal: 45450,
    customerName: 'Ruvini De Silva',
    address: '104, Dharmapala Mawatha, Colombo 07',
    city: 'Colombo 07',
    district: 'Colombo',
    phone1: '+94 70 123 4455',
    phone2: '+94 11 269 8812',
    latitude: 6.9112,
    longitude: 79.8646,
    googleMapsUrl: 'https://maps.google.com/?q=6.9112,79.8646',
    paymentStatus: 'VERIFIED',
    orderStatus: 'DELIVERED',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    paymentReference: 'COMB-FT-883192',
    source: 'facebook',
    courier: {
      courierCompany: 'Domex',
      trackingNumber: 'DX-881290',
      dispatchedAt: '2026-09-27T10:00:00',
      deliveredAt: '2026-09-28T15:30:00'
    },
    createdAt: '2026-09-27T08:30:00',
    updatedAt: '2026-09-28T15:30:00'
  }
];

export const INITIAL_FACEBOOK_POSTS: FacebookPost[] = [
  {
    id: 'fb_post_001',
    tenantId: 'tenant_apex',
    productId: 'prod_sam_a15',
    productName: 'Samsung Galaxy A15 (8GB RAM / 128GB)',
    caption: `🔥 BRAND NEW SAMSUNG GALAXY A15 5G (8GB / 128GB) 🔥\n\nOnly Rs. 45,000!\n\n✨ 6.5" Super AMOLED 90Hz Display\n📸 50MP High-Resolution Triple Camera\n🔋 5,000mAh Massive Battery + 25W Fast Charge\n🛡️ 1 Year Company Warranty | TRCSL Approved\n\n🚚 Islandwide Delivery to your doorstep within 24-48 Hours (Rs. 450)\n\n👇 Click "Send WhatsApp Message" to reserve yours now!`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80'
    ],
    mediaType: 'image',
    status: 'published',
    publishedAt: '2026-09-28T09:30:00Z',
    metrics: {
      impressions: 14850,
      reach: 11200,
      clicks: 864,
      whatsappClicks: 342,
      ordersCount: 18
    }
  },
  {
    id: 'fb_post_002',
    tenantId: 'tenant_apex',
    productId: 'prod_redmi_13',
    productName: 'Xiaomi Redmi 13C (8GB RAM / 256GB)',
    caption: `⚡ BEST BUDGET SMARTPHONE 2026: Xiaomi Redmi 13C (256GB Storage) ⚡\n\nPrice: Rs. 38,900 only!\n\n💥 256GB Massive Storage for all your photos and 4K videos\n💥 50MP AI Dual Camera\n💥 Genuine Genxt Sri Lanka Warranty\n\n🚚 Islandwide Courier Delivery available.\nDirect bank transfer or online deposit.\n\n👇 Tap below to connect with our WhatsApp sales desk!`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80'
    ],
    mediaType: 'image',
    status: 'published',
    publishedAt: '2026-09-29T11:15:00Z',
    metrics: {
      impressions: 8900,
      reach: 6750,
      clicks: 512,
      whatsappClicks: 198,
      ordersCount: 9
    }
  }
];

export const INITIAL_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'msg_001',
    tenantId: 'tenant_apex',
    orderId: 'ord_10025',
    customerPhone: '+94 77 821 9920',
    customerName: 'Kasun Perera',
    direction: 'inbound',
    type: 'text',
    content: 'Hi, I saw your Facebook post for Samsung Galaxy A15 (Rs. 45,000). Is this available with islandwide courier delivery?',
    timestamp: '2026-09-30T09:40:00',
    status: 'read'
  },
  {
    id: 'msg_002',
    tenantId: 'tenant_apex',
    orderId: 'ord_10025',
    customerPhone: '+94 77 821 9920',
    customerName: 'Kasun Perera',
    direction: 'outbound',
    type: 'template',
    content: `Hello Kasun! Thank you for contacting Apex Mobile Colombo. Yes, the Samsung Galaxy A15 is in stock with 1 Year Company Warranty!\n\nItem Price: Rs. 45,000\nCourier Charge: Rs. 450\nTotal Amount: Rs. 45,450\n\nPlease complete your delivery details & upload the bank slip using this secure order link:\n👉 https://apexmobile.lk/order/10025`,
    timestamp: '2026-09-30T09:42:00',
    status: 'read'
  },
  {
    id: 'msg_003',
    tenantId: 'tenant_apex',
    orderId: 'ord_10025',
    customerPhone: '+94 77 821 9920',
    customerName: 'Kasun Perera',
    direction: 'inbound',
    type: 'text',
    content: 'Thank you! I have filled out the delivery form and uploaded my Commercial Bank deposit slip for Rs. 45,450. Please check.',
    timestamp: '2026-09-30T10:16:00',
    status: 'read'
  }
];
