import React, { useState } from 'react';
import { useCommerce } from '../context/CommerceContext';
import {
  MessageSquare,
  Send,
  Phone,
  CheckCheck,
  Check,
  Search,
  Bot,
  User,
  ExternalLink,
  Receipt,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { WhatsAppMessage } from '../types';

export const WhatsAppChatSimulator: React.FC = () => {
  const {
    messages,
    orders,
    selectedTenant,
    sendWhatsAppMessage,
    setCustomerModalOpen
  } = useCommerce();

  const tenantMessages = messages.filter((m) => m.tenantId === selectedTenant.id);

  // Group messages by customer phone
  const conversationsMap = new Map<string, WhatsAppMessage[]>();
  tenantMessages.forEach((msg) => {
    const list = conversationsMap.get(msg.customerPhone) || [];
    list.push(msg);
    conversationsMap.set(msg.customerPhone, list);
  });

  const conversationPhones = Array.from(conversationsMap.keys());
  const [selectedPhone, setSelectedPhone] = useState<string>(
    conversationPhones[0] || '+94 77 821 9920'
  );
  const [replyText, setReplyText] = useState('');

  const activeThread = (conversationsMap.get(selectedPhone) || []).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const matchedOrder = orders.find(
    (o) => o.phone1 === selectedPhone && o.tenantId === selectedTenant.id
  );

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    sendWhatsAppMessage(
      matchedOrder?.id || '',
      selectedPhone,
      matchedOrder?.customerName || 'Customer',
      replyText,
      'text'
    );
    setReplyText('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              WhatsApp Business Bot & Messaging Desk
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              API Webhook Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated customer greeting, instant delivery form links, payment updates, and agent chat
          </p>
        </div>

        <button
          onClick={() => setCustomerModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          Simulate Customer Interaction
        </button>
      </div>

      {/* WhatsApp Interface Mockup */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: Chat Threads List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Conversations ({conversationPhones.length})
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                {selectedTenant.whatsappNumber}
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversationPhones.map((phone) => {
              const thread = conversationsMap.get(phone) || [];
              const lastMsg = thread[thread.length - 1];
              const customerOrder = orders.find(
                (o) => o.phone1 === phone && o.tenantId === selectedTenant.id
              );
              const isSelected = selectedPhone === phone;

              return (
                <div
                  key={phone}
                  onClick={() => setSelectedPhone(phone)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {customerOrder?.customerName || lastMsg?.customerName || 'Customer'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono mt-0.5 truncate">
                    {phone}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-1">
                    {lastMsg?.content}
                  </p>
                  {customerOrder && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {customerOrder.orderNumber}
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-800">
                        {selectedTenant.currency} {customerOrder.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {conversationPhones.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active chat threads yet
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Chat View (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-[#EFEAE2] relative">
          {/* WhatsApp Chat Top Bar */}
          <div className="bg-[#008069] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white border border-white/30">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">
                  {matchedOrder?.customerName || 'Customer'}
                </div>
                <div className="text-[11px] text-emerald-100 font-mono">
                  {selectedPhone} {matchedOrder ? `· Order ${matchedOrder.orderNumber}` : ''}
                </div>
              </div>
            </div>

            {matchedOrder && (
              <a
                href={`https://wa.me/${selectedPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors"
                title="Open WhatsApp Web window"
              >
                <span>WhatsApp Web</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeThread.map((msg) => {
              const isOutbound = msg.direction === 'outbound';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-xs space-y-1 ${
                      isOutbound
                        ? 'bg-[#D9FDD3] text-slate-900 rounded-tr-xs'
                        : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                    }`}
                  >
                    {msg.type === 'template' && (
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Automated System Template</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isOutbound && (
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Quick Actions Bar */}
          <div className="bg-slate-100 p-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Quick Templates:
            </span>
            <button
              onClick={() => {
                if (matchedOrder) {
                  sendWhatsAppMessage(
                    matchedOrder.id,
                    selectedPhone,
                    matchedOrder.customerName,
                    `Hello ${matchedOrder.customerName}! Your order ${matchedOrder.orderNumber} is confirmed. Please complete your delivery form here: https://${selectedTenant.slug}.lk/order/${matchedOrder.id}`,
                    'template'
                  );
                }
              }}
              className="text-[10px] bg-white hover:bg-slate-200 border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium"
            >
              1. Delivery Form Link
            </button>
            <button
              onClick={() => {
                if (matchedOrder) {
                  sendWhatsAppMessage(
                    matchedOrder.id,
                    selectedPhone,
                    matchedOrder.customerName,
                    `✅ Payment for ${matchedOrder.orderNumber} is confirmed! Packing is in progress.`,
                    'template'
                  );
                }
              }}
              className="text-[10px] bg-white hover:bg-slate-200 border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium"
            >
              2. Payment Confirmed
            </button>
            <button
              onClick={() => {
                if (matchedOrder) {
                  sendWhatsAppMessage(
                    matchedOrder.id,
                    selectedPhone,
                    matchedOrder.customerName,
                    `📦 Your package has been dispatched via Domex Courier! Delivery within 24-48 hours.`,
                    'template'
                  );
                }
              }}
              className="text-[10px] bg-white hover:bg-slate-200 border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium"
            >
              3. Dispatch Notice
            </button>
          </div>

          {/* Reply Input Bar */}
          <form
            onSubmit={handleSendReply}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type message to send via official WhatsApp Business API..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-[#008069] hover:bg-[#006e5a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
