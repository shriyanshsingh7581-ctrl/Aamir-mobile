import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { CartItem, CustomerOrder } from '../types';
import {
  calculateCartSummary,
  generateOrderNumber,
  validatePhoneInput,
  buildWhatsAppUrl,
} from '../utils/storeLogic';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  ordersCount: number;
  onPlaceOrder: (order: CustomerOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  ordersCount,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<
    'Store Pickup (Purana Dhampur Chungi)' | 'Dhampur Local Delivery'
  >('Store Pickup (Purana Dhampur Chungi)');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null);

  if (!isOpen) return null;

  const summary = calculateCartSummary(items);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!customerName.trim()) {
      setCheckoutError('Please enter your name.');
      return;
    }
    if (!validatePhoneInput(customerPhone)) {
      setCheckoutError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const orderNumber = generateOrderNumber(ordersCount);
    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMode,
      items: [...items],
      totalAmount: summary.subtotal,
      createdAt: 'Just now',
      status: 'Confirmed',
    };

    onPlaceOrder(newOrder);
    setPlacedOrder(newOrder);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
    >
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2
              id="cart-drawer-title"
              className="font-display text-lg font-bold text-white"
            >
              Your Aamir Mobile Bag ({summary.totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlacedOrder(null);
              onClose();
            }}
            aria-label="Close shopping cart"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {placedOrder ? (
            <div className="bg-slate-950 border-2 border-emerald-500 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-400">
                    Order Synced to Store Admin
                  </p>
                  <h3 className="text-base font-bold text-white">
                    {placedOrder.orderNumber} Confirmed!
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Thank you <strong className="text-white">{placedOrder.customerName}</strong>!
                Your order of{' '}
                <strong className="font-mono-num text-amber-400">
                  ₹{placedOrder.totalAmount.toLocaleString('en-IN')}
                </strong>{' '}
                is registered for {placedOrder.deliveryMode}.
              </p>

              <a
                href={buildWhatsAppUrl(
                  `🛍️ *NEW ORDER ${placedOrder.orderNumber} — AAMIR MOBILE DHAMPUR*\n• *Items:* ${placedOrder.items
                    .map((i) => `${i.name} x${i.quantity}`)
                    .join(', ')}\n• *Total:* ₹${placedOrder.totalAmount.toLocaleString(
                    'en-IN'
                  )}\n• *Mode:* ${placedOrder.deliveryMode}\n• *Customer:* ${
                    placedOrder.customerName
                  } (${placedOrder.customerPhone})`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order Receipt on WhatsApp (9897060816)</span>
              </a>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-semibold text-white">
                Your shopping bag is empty
              </p>
              <p className="text-xs text-slate-400">
                Add second-hand 4G/5G phones or original accessories to place an
                order.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                      <p className="font-mono-num text-xs font-bold text-amber-400 mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono-num text-xs font-bold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from bag`}
                        className="w-7 h-7 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form
                onSubmit={handleCheckout}
                className="pt-4 border-t border-slate-800 space-y-3"
              >
                <div className="text-xs space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Total MRP</span>
                    <span className="font-mono-num line-through">
                      ₹{summary.totalMrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Store Discount</span>
                    <span className="font-mono-num">
                      -₹{summary.totalSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                    <span>Payable Total</span>
                    <span className="font-mono-num text-amber-400">
                      ₹{summary.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cart-customer-name"
                    className="block text-xs font-semibold text-slate-300 mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    id="cart-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cart-customer-phone"
                    className="block text-xs font-semibold text-slate-300 mb-1"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="cart-customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cart-delivery-mode"
                    className="block text-xs font-semibold text-slate-300 mb-1"
                  >
                    Pickup / Delivery Preference
                  </label>
                  <select
                    id="cart-delivery-mode"
                    value={deliveryMode}
                    onChange={(e) =>
                      setDeliveryMode(
                        e.target.value as
                          | 'Store Pickup (Purana Dhampur Chungi)'
                          | 'Dhampur Local Delivery'
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Store Pickup (Purana Dhampur Chungi)">
                      Store Pickup (Purana Dhampur Chungi)
                    </option>
                    <option value="Dhampur Local Delivery">
                      Dhampur Local Delivery
                    </option>
                  </select>
                </div>

                {checkoutError && (
                  <p role="alert" className="text-xs text-red-400 font-semibold">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 min-h-[44px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  Confirm Order (₹{summary.subtotal.toLocaleString('en-IN')})
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
