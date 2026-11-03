/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AccessoryItem,
  CartItem,
  CustomerOrder,
  RepairAppointment,
  SecondHandPhone,
  SellPhoneLead,
} from './types';
import {
  INITIAL_ACCESSORIES,
  INITIAL_ORDERS,
  INITIAL_REPAIR_APPOINTMENTS,
  INITIAL_SECOND_HAND_PHONES,
  INITIAL_SELL_LEADS,
} from './data/initialData';
import {
  calculateCartSummary,
  cycleRepairStatus,
} from './utils/storeLogic';
import {
  auth,
  onAuthStateChanged,
  User,
  signInWithGooglePopup,
  signOutFirebase,
  subscribePublicCatalogue,
  subscribeAuthenticatedCollections,
  savePhoneToFirestore,
  deletePhoneFromFirestore,
  saveAccessoryToFirestore,
  deleteAccessoryFromFirestore,
  saveAppointmentToFirestore,
  updateAppointmentStatusInFirestore,
  saveSellLeadToFirestore,
  updateSellLeadStatusInFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  seedCatalogueToFirestore,
} from './firebase';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PhonesModule } from './components/PhonesModule';
import { RepairModule } from './components/RepairModule';
import { AccessoriesModule } from './components/AccessoriesModule';
import { ShopGalleryAndFooter } from './components/ShopGalleryAndFooter';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';

const STORAGE_KEYS = {
  PHONES: 'am_dhampur_phones_v2',
  ACCESSORIES: 'am_dhampur_accessories_v2',
  APPOINTMENTS: 'am_dhampur_appointments_v2',
  SELL_LEADS: 'am_dhampur_sell_leads_v2',
  ORDERS: 'am_dhampur_orders_v2',
  CART: 'am_dhampur_cart_v2',
  ADMIN_UNLOCKED: 'am_dhampur_admin_unlocked_v2',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<'customer' | 'admin'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('admin') === 'true' ||
      window.location.pathname === '/admin'
    ) {
      return 'admin';
    }
    return 'customer';
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.ADMIN_UNLOCKED, false)
  );

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const [phones, setPhones] = useState<SecondHandPhone[]>(() =>
    loadFromStorage(STORAGE_KEYS.PHONES, INITIAL_SECOND_HAND_PHONES)
  );
  const [accessories, setAccessories] = useState<AccessoryItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.ACCESSORIES, INITIAL_ACCESSORIES)
  );
  const [appointments, setAppointments] = useState<RepairAppointment[]>(() =>
    loadFromStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_REPAIR_APPOINTMENTS)
  );
  const [sellLeads, setSellLeads] = useState<SellPhoneLead[]>(() =>
    loadFromStorage(STORAGE_KEYS.SELL_LEADS, INITIAL_SELL_LEADS)
  );
  const [orders, setOrders] = useState<CustomerOrder[]>(() =>
    loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.CART, [])
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [phonesTab, setPhonesTab] = useState<'buy' | 'sell'>('buy');
  const [activeMobileSection, setActiveMobileSection] = useState('top');

  // 1. Track Firebase Auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubAuth();
  }, []);

  // 2. Subscribe to Public Firestore Catalogue (/phones and /accessories)
  useEffect(() => {
    const unsub = subscribePublicCatalogue(
      (cloudPhones) => {
        if (cloudPhones.length > 0) {
          setPhones(cloudPhones);
        }
      },
      (cloudAccessories) => {
        if (cloudAccessories.length > 0) {
          setAccessories(cloudAccessories);
        }
      },
      (connected) => setIsFirebaseConnected(connected)
    );
    return () => unsub();
  }, []);

  // 3. Subscribe to Private Firestore Collections when authenticated
  useEffect(() => {
    if (!firebaseUser) return;
    const isAdminUser =
      firebaseUser.email === 'singhshriyansh51@gmail.com' &&
      firebaseUser.emailVerified;
    const unsub = subscribeAuthenticatedCollections(
      firebaseUser,
      isAdminUser,
      (cloudAppointments) => {
        if (cloudAppointments.length > 0) {
          setAppointments(cloudAppointments);
        }
      },
      (cloudLeads) => {
        if (cloudLeads.length > 0) {
          setSellLeads(cloudLeads);
        }
      },
      (cloudOrders) => {
        if (cloudOrders.length > 0) {
          setOrders(cloudOrders);
        }
      }
    );
    return () => unsub();
  }, [firebaseUser]);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PHONES, JSON.stringify(phones));
    } catch {
      // Ignore quota errors
    }
  }, [phones]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.ACCESSORIES,
        JSON.stringify(accessories)
      );
    } catch {
      // Ignore quota errors
    }
  }, [accessories]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.APPOINTMENTS,
        JSON.stringify(appointments)
      );
    } catch {
      // Ignore quota errors
    }
  }, [appointments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SELL_LEADS,
        JSON.stringify(sellLeads)
      );
    } catch {
      // Ignore quota errors
    }
  }, [sellLeads]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.ADMIN_UNLOCKED,
        JSON.stringify(isAdminUnlocked)
      );
    } catch {
      // Ignore quota errors
    }
  }, [isAdminUnlocked]);

  const handleSwitchView = (view: 'customer' | 'admin') => {
    setActiveView(view);
    const url = new URL(window.location.href);
    if (view === 'admin') {
      url.searchParams.set('admin', 'true');
    } else {
      url.searchParams.delete('admin');
    }
    window.history.replaceState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveMobileSection(sectionId);
    if (sectionId === 'sell-scrap-section') {
      setPhonesTab('sell');
    } else if (sectionId === 'phones-section') {
      setPhonesTab('buy');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleHeroQuickAction = (
    action: 'buy-phones' | 'sell-scrap' | 'book-repair' | 'shop-accessories'
  ) => {
    if (action === 'buy-phones') {
      setPhonesTab('buy');
      handleNavigateSection('phones-section');
    } else if (action === 'sell-scrap') {
      setPhonesTab('sell');
      handleNavigateSection('phones-section');
    } else if (action === 'book-repair') {
      handleNavigateSection('repair-section');
    } else if (action === 'shop-accessories') {
      handleNavigateSection('accessories-section');
    }
  };

  // Cart Handlers
  const handleAddPhoneToCart = (phone: SecondHandPhone) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === phone.id);
      if (existing) {
        return prev.map((i) =>
          i.id === phone.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: phone.id,
          itemType: 'phone',
          name: `${phone.brand} ${phone.model}`,
          subtitle: `${phone.ramStorage} · ${phone.conditionBadge}`,
          price: phone.price,
          mrp: phone.mrp,
          quantity: 1,
          image: phone.image,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddAccessoryToCart = (item: AccessoryItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          itemType: 'accessory',
          name: item.name,
          subtitle: item.category,
          price: item.price,
          mrp: item.mrp,
          quantity: 1,
          image: item.image,
        },
      ];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    if (auth.currentUser) {
      saveOrderToFirestore(order).catch(() => {});
    }
  };

  const cartSummary = calculateCartSummary(cart);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar
        activeView={activeView}
        onSwitchView={handleSwitchView}
        cartCount={cartSummary.totalItems}
        onOpenCart={() => setIsCartOpen(true)}
        activeMobileSection={activeMobileSection}
        onNavigateSection={handleNavigateSection}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
        isFirebaseConnected={isFirebaseConnected}
      />

      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminPanel
            isUnlocked={isAdminUnlocked}
            onUnlock={() => setIsAdminUnlocked(true)}
            onExitAdmin={() => handleSwitchView('customer')}
            appointments={appointments}
            onUpdateAppointmentStatus={(id) => {
              setAppointments((prev) =>
                prev.map((a) => {
                  if (a.id !== id) return a;
                  const next = cycleRepairStatus(a.status);
                  if (auth.currentUser) {
                    updateAppointmentStatusInFirestore(id, next).catch(() => {});
                  }
                  return { ...a, status: next };
                })
              );
            }}
            sellLeads={sellLeads}
            onUpdateSellLeadStatus={(id, status) => {
              setSellLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status } : l))
              );
              if (auth.currentUser) {
                updateSellLeadStatusInFirestore(id, status).catch(() => {});
              }
            }}
            phones={phones}
            onAddPhone={(newPhone) => {
              setPhones((prev) => [newPhone, ...prev]);
              if (auth.currentUser) {
                savePhoneToFirestore(newPhone).catch(() => {});
              }
            }}
            onDeletePhone={(id) => {
              setPhones((prev) => prev.filter((p) => p.id !== id));
              if (auth.currentUser) {
                deletePhoneFromFirestore(id).catch(() => {});
              }
            }}
            accessories={accessories}
            onAddAccessory={(newAcc) => {
              setAccessories((prev) => [newAcc, ...prev]);
              if (auth.currentUser) {
                saveAccessoryToFirestore(newAcc).catch(() => {});
              }
            }}
            onDeleteAccessory={(id) => {
              setAccessories((prev) => prev.filter((a) => a.id !== id));
              if (auth.currentUser) {
                deleteAccessoryFromFirestore(id).catch(() => {});
              }
            }}
            orders={orders}
            onUpdateOrderStatus={(id, status) => {
              setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status } : o))
              );
              if (auth.currentUser) {
                updateOrderStatusInFirestore(id, status).catch(() => {});
              }
            }}
            firebaseUser={firebaseUser}
            isFirebaseConnected={isFirebaseConnected}
            onSignInGoogle={async () => {
              await signInWithGooglePopup();
            }}
            onSignOutGoogle={async () => {
              await signOutFirebase();
            }}
            onSyncCatalogueToCloud={async () => {
              await seedCatalogueToFirestore(phones, accessories);
            }}
          />
        ) : (
          <>
            <HeroSection
              globalSearch={globalSearch}
              onGlobalSearchChange={setGlobalSearch}
              onQuickAction={handleHeroQuickAction}
              activeView={activeView}
              onSwitchView={handleSwitchView}
              isFirebaseConnected={isFirebaseConnected}
            />

            <PhonesModule
              phones={phones}
              globalSearch={globalSearch}
              activeTab={phonesTab}
              onTabChange={setPhonesTab}
              onAddPhoneToCart={handleAddPhoneToCart}
              onCreateSellLead={(lead) => {
                setSellLeads((prev) => [lead, ...prev]);
                if (auth.currentUser) {
                  saveSellLeadToFirestore(lead).catch(() => {});
                }
              }}
            />

            <RepairModule
              appointmentsCount={appointments.length}
              onCreateAppointment={(booking) => {
                setAppointments((prev) => [booking, ...prev]);
                if (auth.currentUser) {
                  saveAppointmentToFirestore(booking).catch(() => {});
                }
              }}
              globalSearch={globalSearch}
            />

            <AccessoriesModule
              accessories={accessories}
              globalSearch={globalSearch}
              onAddAccessoryToCart={handleAddAccessoryToCart}
            />

            <ShopGalleryAndFooter
              onOpenAdmin={() => handleSwitchView('admin')}
            />
          </>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        ordersCount={orders.length}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
