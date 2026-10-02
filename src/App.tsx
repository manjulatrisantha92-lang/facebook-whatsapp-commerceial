import React, { useState } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductManagement } from './components/ProductManagement';
import { ProductFormModal } from './components/ProductFormModal';
import { FacebookComposer } from './components/FacebookComposer';
import { OrdersManagement } from './components/OrdersManagement';
import { CustomerOrderPortal } from './components/CustomerOrderPortal';
import { PaymentVerificationModal } from './components/PaymentVerificationModal';
import { WhatsAppChatSimulator } from './components/WhatsAppChatSimulator';
import { SuperAdminView } from './components/SuperAdminView';
import { SettingsModal } from './components/SettingsModal';
import { NewTenantModal } from './components/NewTenantModal';
import { Product } from './types';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  AlertTriangle
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toasts,
    removeToast,
    customerModalOpen,
    setCustomerModalOpen,
    targetProductForCustomer,
    setTargetProductForCustomer
  } = useCommerce();

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [initialOpenVideo, setInitialOpenVideo] = useState(false);
  const [newTenantModalOpen, setNewTenantModalOpen] = useState(false);
  const [selectedOrderIdForDrawer, setSelectedOrderIdForDrawer] = useState<string | null>(null);

  const handleOpenAddProduct = (openVideo: boolean = false) => {
    setProductToEdit(null);
    setInitialOpenVideo(openVideo);
    setProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product, openVideo: boolean = false) => {
    setProductToEdit(prod);
    setInitialOpenVideo(openVideo);
    setProductModalOpen(true);
  };

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderIdForDrawer(orderId);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Header onOpenNewTenant={() => setNewTenantModalOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-53px)] pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddProduct={handleOpenAddProduct}
              onOpenOrder={handleOpenOrder}
            />
          )}

          {activeTab === 'products' && (
            <ProductManagement
              onOpenAddModal={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
            />
          )}

          {activeTab === 'facebook' && <FacebookComposer />}

          {activeTab === 'orders' && (
            <OrdersManagement
              selectedOrderId={selectedOrderIdForDrawer}
              onCloseOrderDetail={() => setSelectedOrderIdForDrawer(null)}
            />
          )}

          {activeTab === 'payments' && (
            <OrdersManagement
              selectedOrderId={selectedOrderIdForDrawer}
              onCloseOrderDetail={() => setSelectedOrderIdForDrawer(null)}
            />
          )}

          {activeTab === 'whatsapp' && <WhatsAppChatSimulator />}

          {activeTab === 'settings' && <SettingsModal />}

          {activeTab === 'superadmin' && (
            <SuperAdminView onOpenNewTenant={() => setNewTenantModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setProductToEdit(null);
          setInitialOpenVideo(false);
        }}
        productToEdit={productToEdit}
        initialOpenVideo={initialOpenVideo}
      />

      <CustomerOrderPortal
        isOpen={customerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false);
          setTargetProductForCustomer(null);
        }}
        presetProduct={targetProductForCustomer}
      />

      <PaymentVerificationModal />

      <NewTenantModal
        isOpen={newTenantModalOpen}
        onClose={() => setNewTenantModalOpen(false)}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />,
            info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
            error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          };

          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center gap-2.5">
                {icons[toast.type]}
                <span className="leading-snug text-slate-100">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CommerceProvider>
      <MainLayout />
    </CommerceProvider>
  );
}
