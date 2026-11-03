import React, { useState } from 'react';
import {
  Lock,
  Wrench,
  Smartphone,
  ShoppingBag,
  PackagePlus,
  PhoneCall,
  MessageCircle,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Database,
  LogIn,
  LogOut,
  CloudUpload,
} from 'lucide-react';
import {
  AccessoryCategory,
  AccessoryItem,
  CustomerOrder,
  PhoneConditionBadge,
  PhoneNetwork,
  RepairAppointment,
  SecondHandPhone,
  SellPhoneLead,
} from '../types';
import {
  verifyAdminPin,
  cycleRepairStatus,
  buildWhatsAppUrl,
} from '../utils/storeLogic';
import { User } from '../firebase';

interface AdminPanelProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onExitAdmin: () => void;
  appointments: RepairAppointment[];
  onUpdateAppointmentStatus: (id: string) => void;
  sellLeads: SellPhoneLead[];
  onUpdateSellLeadStatus: (
    id: string,
    status: SellPhoneLead['status']
  ) => void;
  phones: SecondHandPhone[];
  onAddPhone: (phone: SecondHandPhone) => void;
  onDeletePhone: (id: string) => void;
  accessories: AccessoryItem[];
  onAddAccessory: (item: AccessoryItem) => void;
  onDeleteAccessory: (id: string) => void;
  orders: CustomerOrder[];
  onUpdateOrderStatus: (id: string, status: CustomerOrder['status']) => void;
  firebaseUser?: User | null;
  isFirebaseConnected?: boolean;
  onSignInGoogle?: () => Promise<void>;
  onSignOutGoogle?: () => Promise<void>;
  onSyncCatalogueToCloud?: () => Promise<void>;
}

type AdminTab = 'repairs' | 'leads' | 'catalogue' | 'orders';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isUnlocked,
  onUnlock,
  onExitAdmin,
  appointments,
  onUpdateAppointmentStatus,
  sellLeads,
  onUpdateSellLeadStatus,
  phones,
  onAddPhone,
  onDeletePhone,
  accessories,
  onAddAccessory,
  onDeleteAccessory,
  orders,
  onUpdateOrderStatus,
  firebaseUser,
  isFirebaseConnected = true,
  onSignInGoogle,
  onSignOutGoogle,
  onSyncCatalogueToCloud,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('repairs');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Add New Item Form State
  const [itemType, setItemType] = useState<'phone' | 'accessory'>('phone');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newNameOrModel, setNewNameOrModel] = useState('');
  const [newNetwork, setNewNetwork] = useState<PhoneNetwork>('5G');
  const [newRamStorage, setNewRamStorage] = useState('8GB / 128GB');
  const [newBattery] = useState('92');
  const [newCondition, setNewCondition] =
    useState<PhoneConditionBadge>('Mint Condition');
  const [newCategory, setNewCategory] = useState<
    Exclude<AccessoryCategory, 'All Accessories'>
  >('TWS Earbuds & Neckbands');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newSpecsOrNote, setNewSpecsOrNote] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [catalogueSuccess, setCatalogueSuccess] = useState<string | null>(null);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pinInput)) {
      setPinError(null);
      onUnlock();
    } else {
      setPinError('Incorrect Admin PIN. Please enter 7777.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCloudSeed = async () => {
    if (!onSyncCatalogueToCloud) return;
    try {
      await onSyncCatalogueToCloud();
      setSyncMessage('All phones & accessories synced to Firebase Firestore!');
      setTimeout(() => setSyncMessage(null), 3500);
    } catch {
      setSyncMessage('Sign in with Google Admin account to push to cloud.');
    }
  };

  const handleAddCatalogueItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(newPrice);
    const mrpNum = Number(newMrp) || Math.round(priceNum * 1.35);
    if (!newNameOrModel.trim() || !priceNum || priceNum <= 0) {
      return;
    }

    if (itemType === 'phone') {
      const createdPhone: SecondHandPhone = {
        id: `ph-${Date.now()}`,
        brand: newBrand.trim() || 'Smartphone',
        model: newNameOrModel.trim(),
        network: newNetwork,
        ramStorage: newRamStorage.trim() || '8GB / 128GB',
        batteryHealth: Number(newBattery) || 92,
        conditionBadge: newCondition,
        price: priceNum,
        mrp: mrpNum,
        image:
          newPhotoUrl.trim() ||
          '/assets/aistudio/IMG-20261103-WA0075_142004cc.jpg',
        color: 'Store Verified Edition',
        inStock: true,
        verifiedNote:
          newSpecsOrNote.trim() ||
          '32-Point Checked at Aamir Mobile Dhampur Lab',
      };
      onAddPhone(createdPhone);
      setCatalogueSuccess(
        `Added ${createdPhone.brand} ${createdPhone.model} to Live Catalogue!`
      );
    } else {
      const createdAcc: AccessoryItem = {
        id: `acc-${Date.now()}`,
        name: newNameOrModel.trim(),
        category: newCategory,
        brand: newBrand.trim() || 'AM Original Series',
        price: priceNum,
        mrp: mrpNum,
        discountLabel: 'STORE DEAL',
        image:
          newPhotoUrl.trim() ||
          '/assets/aistudio/IMG-20261103-WA0074_db4f0c7f.jpg',
        specs:
          newSpecsOrNote.trim() ||
          'Available at Aamir Mobile Purana Dhampur Chungi',
        inStock: true,
      };
      onAddAccessory(createdAcc);
      setCatalogueSuccess(
        `Added ${createdAcc.name} to Mobile Accessories Catalogue!`
      );
    }

    setNewNameOrModel('');
    setNewPrice('');
    setNewMrp('');
    setNewSpecsOrNote('');
    setNewPhotoUrl('');
  };

  if (!isUnlocked) {
    return (
      <section className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border-2 border-[#ea580c] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Store</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-extrabold text-[#ea580c]">
              AAMIR MOBILE DHAMPUR · FIREBASE REAL-TIME PORTAL
            </p>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
              Store Admin Portal Login
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage IC-Level Repair Appointments, Scrap/Old Phone Buy Leads,
              Catalogue Items &amp; Customer Orders.
            </p>
            <p className="mt-2 text-xs font-mono-num font-extrabold text-[#ea580c] bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg inline-block">
              Demo Admin PIN: 7777
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-pin-input"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Enter 4-Digit Store PIN
              </label>
              <input
                id="admin-pin-input"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="7777"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-xl font-mono-num tracking-widest text-slate-900 focus:border-[#ea580c] focus:outline-none"
              />
            </div>

            {pinError && (
              <p role="alert" className="text-xs text-red-600 font-bold">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 min-h-[46px] bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl transition-colors shadow-sm"
            >
              Unlock Store Admin Dashboard
            </button>
          </form>
        </div>
      </section>
    );
  }

  const totalCatalogueCount = phones.length + accessories.length;

  return (
    <section className="py-8 lg:py-10 pb-24 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
      {/* Admin Top Header + Firebase Cloud Auth Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <Database className="w-3.5 h-3.5" />
              <span>
                {isFirebaseConnected
                  ? 'FIREBASE FIRESTORE REAL-TIME CONNECTED'
                  : 'LOCAL REAL-TIME SYNC'}
              </span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Purana Dhampur Chungi, Kalagarh Road
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Aamir Mobile — Store Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {firebaseUser ? (
            <>
              <button
                type="button"
                onClick={handleCloudSeed}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Sync Catalogue to Cloud DB</span>
              </button>
              <button
                type="button"
                onClick={onSignOutGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({firebaseUser.email?.split('@')[0]})</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onSignInGoogle}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Google Admin Sign-In (Cloud Sync)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExitAdmin}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 4 Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('repairs')}
          className={`text-left p-5 rounded-2xl border bg-white transition-all shadow-xs ${
            activeTab === 'repairs'
              ? 'border-2 border-[#ea580c]'
              : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Repair Appointments</span>
            <Wrench className="w-4 h-4 text-[#ea580c]" />
          </div>
          <p className="font-mono-num text-3xl font-extrabold text-slate-900 mt-2">
            {appointments.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            IC-Level &amp; Folder Bookings
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`text-left p-5 rounded-2xl border bg-white transition-all shadow-xs ${
            activeTab === 'leads'
              ? 'border-2 border-[#ea580c]'
              : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Old/Scrap Phone Sell Requests</span>
            <Smartphone className="w-4 h-4 text-[#ea580c]" />
          </div>
          <p className="font-mono-num text-3xl font-extrabold text-slate-900 mt-2">
            {sellLeads.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Working &amp; Dead/Scrap Leads
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`text-left p-5 rounded-2xl border bg-white transition-all shadow-xs ${
            activeTab === 'orders'
              ? 'border-2 border-[#ea580c]'
              : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Accessory &amp; Phone Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#ea580c]" />
          </div>
          <p className="font-mono-num text-3xl font-extrabold text-slate-900 mt-2">
            {orders.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Customer Storefront Orders
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalogue')}
          className={`text-left p-5 rounded-2xl border bg-white transition-all shadow-xs ${
            activeTab === 'catalogue'
              ? 'border-2 border-[#ea580c]'
              : 'border-slate-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Catalogue Items</span>
            <PackagePlus className="w-4 h-4 text-[#ea580c]" />
          </div>
          <p className="font-mono-num text-3xl font-extrabold text-slate-900 mt-2">
            {totalCatalogueCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {phones.length} Phones · {accessories.length} Accessories
          </p>
        </button>
      </div>

      {/* 4 Management Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white p-2 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('repairs')}
          className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-extrabold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'repairs'
              ? 'bg-[#ea580c] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          1. Repair Appointments Manager ({appointments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-extrabold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'leads'
              ? 'bg-[#ea580c] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          2. Used &amp; Scrap Phone Buy Leads ({sellLeads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalogue')}
          className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-extrabold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'catalogue'
              ? 'bg-[#ea580c] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          3. Manage Phones &amp; Accessories (+ Add New Item)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 min-h-[40px] text-xs sm:text-sm font-extrabold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#ea580c] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          4. Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: REPAIR APPOINTMENTS MANAGER */}
      {activeTab === 'repairs' && (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const nextStatus = cycleRepairStatus(apt.status);
            const readyAlertMsg = `Hello ${apt.customerName}! Update from *Aamir Mobile Dhampur* for your repair token *${apt.tokenId}* (${apt.brandModel}): Your phone status is now *${apt.status}*. Contact: +91 9897060816.`;

            return (
              <div
                key={apt.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono-num font-extrabold text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded">
                      {apt.tokenId}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {apt.brandModel}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-slate-500">{apt.createdAt}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    Issues: {apt.issues.join(', ')}
                  </p>

                  <p className="text-xs text-slate-600">
                    Customer:{' '}
                    <strong className="text-slate-900">
                      {apt.customerName}
                    </strong>{' '}
                    (<span className="font-mono-num">{apt.customerPhone}</span>)
                    · Slot: {apt.preferredSlot} · {apt.serviceType}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateAppointmentStatus(apt.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-extrabold text-[#ea580c] rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>
                      Status: {apt.status} (Click → {nextStatus})
                    </span>
                  </button>

                  <a
                    href={`tel:${apt.customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={buildWhatsAppUrl(readyAlertMsg, apt.customerPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Ready Alert</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: USED & SCRAP PHONE BUY LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {sellLeads.map((lead) => {
            const negotiateMsg = `Hello ${lead.customerName}! Regarding your request to sell your ${
              lead.mode === 'scrap' ? 'Dead/Scrap' : 'Second-Hand'
            } *${lead.brand} ${lead.model}* (Expected ₹${lead.expectedPrice.toLocaleString('en-IN')}) at *Aamir Mobile Dhampur*. Please bring the phone to Purana Dhampur Chungi for instant cash.`;

            return (
              <div
                key={lead.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`font-extrabold px-2 py-0.5 rounded ${
                          lead.mode === 'scrap'
                            ? 'bg-amber-100 text-[#ea580c]'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {lead.mode === 'scrap'
                          ? 'SCRAP / DEAD PHONE LEAD'
                          : 'WORKING 2ND-HAND PHONE'}
                      </span>
                      <span className="text-slate-500">{lead.createdAt}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900">
                      {lead.brand} {lead.model}{' '}
                      {lead.ramStorage ? `(${lead.ramStorage})` : ''}
                    </h3>

                    <p className="text-xs text-slate-600">
                      Fault / Condition:{' '}
                      <strong className="text-slate-900">
                        {lead.conditionOrFault}
                      </strong>{' '}
                      · Expected Cash:{' '}
                      <span className="font-mono-num font-extrabold text-emerald-600">
                        ₹{lead.expectedPrice.toLocaleString('en-IN')}
                      </span>
                    </p>

                    <p className="text-xs text-slate-500">
                      Seller:{' '}
                      <strong className="text-slate-800">
                        {lead.customerName}
                      </strong>{' '}
                      (<span className="font-mono-num">{lead.customerPhone}</span>)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <select
                    aria-label={`Status for ${lead.brand} ${lead.model}`}
                    value={lead.status}
                    onChange={(e) =>
                      onUpdateSellLeadStatus(
                        lead.id,
                        e.target.value as SellPhoneLead['status']
                      )
                    }
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Quoted on WhatsApp">
                      Quoted on WhatsApp
                    </option>
                    <option value="Purchased">Purchased</option>
                  </select>

                  <a
                    href={`tel:${lead.customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Seller</span>
                  </a>

                  <a
                    href={buildWhatsAppUrl(negotiateMsg, lead.customerPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Negotiate</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: MANAGE SECOND-HAND PHONES & ACCESSORIES (+ ADD NEW ITEM) */}
      {activeTab === 'catalogue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Add New Item Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              + Add New Second-Hand Phone or Accessory
            </h2>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setItemType('phone')}
                className={`py-2 text-xs font-extrabold rounded-lg transition-colors ${
                  itemType === 'phone'
                    ? 'bg-[#ea580c] text-white'
                    : 'text-slate-700'
                }`}
              >
                Second-Hand Phone
              </button>
              <button
                type="button"
                onClick={() => setItemType('accessory')}
                className={`py-2 text-xs font-extrabold rounded-lg transition-colors ${
                  itemType === 'accessory'
                    ? 'bg-[#ea580c] text-white'
                    : 'text-slate-700'
                }`}
              >
                Mobile Accessory
              </button>
            </div>

            {catalogueSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{catalogueSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddCatalogueItem} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="admin-item-brand"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Brand
                  </label>
                  <input
                    id="admin-item-brand"
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g., Apple / Vivo"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-item-name"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    {itemType === 'phone' ? 'Model Name *' : 'Accessory Name *'}
                  </label>
                  <input
                    id="admin-item-name"
                    type="text"
                    required
                    value={newNameOrModel}
                    onChange={(e) => setNewNameOrModel(e.target.value)}
                    placeholder={
                      itemType === 'phone'
                        ? 'e.g., iPhone 14 128GB'
                        : 'e.g., 80W SuperVOOC Cable'
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {itemType === 'phone' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label
                      htmlFor="admin-phone-net"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Network
                    </label>
                    <select
                      id="admin-phone-net"
                      value={newNetwork}
                      onChange={(e) =>
                        setNewNetwork(e.target.value as PhoneNetwork)
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                    >
                      <option value="5G">5G</option>
                      <option value="4G">4G</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="admin-phone-ram"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      RAM/Storage
                    </label>
                    <input
                      id="admin-phone-ram"
                      type="text"
                      value={newRamStorage}
                      onChange={(e) => setNewRamStorage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-phone-cond"
                      className="block text-xs font-bold text-slate-700 mb-1"
                    >
                      Condition
                    </label>
                    <select
                      id="admin-phone-cond"
                      value={newCondition}
                      onChange={(e) =>
                        setNewCondition(e.target.value as PhoneConditionBadge)
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                    >
                      <option value="Mint Condition">Mint Condition</option>
                      <option value="Warranty Available">
                        Warranty Available
                      </option>
                      <option value="Superb Condition">Superb Condition</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="admin-acc-cat"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Accessory Category
                  </label>
                  <select
                    id="admin-acc-cat"
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as Exclude<
                          AccessoryCategory,
                          'All Accessories'
                        >
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="TWS Earbuds & Neckbands">
                      TWS Earbuds &amp; Neckbands
                    </option>
                    <option value="Fast Chargers & Adapters">
                      Fast Chargers &amp; Adapters
                    </option>
                    <option value="Data Cables">Data Cables</option>
                    <option value="Back Covers & Cases">
                      Back Covers &amp; Cases
                    </option>
                    <option value="Tempered Glass">Tempered Glass</option>
                    <option value="Power Banks & Speakers">
                      Power Banks &amp; Speakers
                    </option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="admin-item-price"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Aamir Mobile Price (₹) *
                  </label>
                  <input
                    id="admin-item-price"
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g., 14500"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono-num"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admin-item-mrp"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    MRP (₹)
                  </label>
                  <input
                    id="admin-item-mrp"
                    type="number"
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    placeholder="e.g., 24999"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-item-specs"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Specs / Warranty Note
                </label>
                <input
                  id="admin-item-specs"
                  type="text"
                  value={newSpecsOrNote}
                  onChange={(e) => setNewSpecsOrNote(e.target.value)}
                  placeholder="e.g., 100% Original Folder · With Box & Charger"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-photo-file"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Upload Photo
                </label>
                <input
                  id="admin-photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-[#ea580c]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 min-h-[44px] bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors"
              >
                + Save Item to Live Store Catalogue
              </button>
            </form>
          </div>

          {/* Existing Catalogue Items List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <h3 className="font-display text-base font-extrabold text-slate-900">
                Second-Hand Phones in Stock ({phones.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {phones.map((ph) => (
                  <div
                    key={ph.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {ph.brand} {ph.model} ({ph.ramStorage})
                      </p>
                      <p className="text-slate-500">
                        <span className="font-mono-num text-emerald-600 font-extrabold">
                          ₹{ph.price.toLocaleString('en-IN')}
                        </span>{' '}
                        · {ph.conditionBadge} · Battery {ph.batteryHealth}%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeletePhone(ph.id)}
                      aria-label={`Delete ${ph.brand} ${ph.model}`}
                      className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <h3 className="font-display text-base font-extrabold text-slate-900">
                Accessories in Stock ({accessories.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {accessories.map((acc) => (
                  <div
                    key={acc.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{acc.name}</p>
                      <p className="text-slate-500">
                        <span className="font-mono-num text-emerald-600 font-extrabold">
                          ₹{acc.price.toLocaleString('en-IN')}
                        </span>{' '}
                        · {acc.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteAccessory(acc.id)}
                      aria-label={`Delete ${acc.name}`}
                      className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono-num font-extrabold text-[#ea580c]">
                    {ord.orderNumber}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-slate-500">{ord.createdAt}</span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-blue-700 font-bold">
                    {ord.deliveryMode}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900">
                  {ord.items
                    .map((i) => `${i.name} (x${i.quantity})`)
                    .join(' + ')}
                </p>

                <p className="text-xs text-slate-600">
                  Customer:{' '}
                  <strong className="text-slate-900">{ord.customerName}</strong>{' '}
                  (<span className="font-mono-num">{ord.customerPhone}</span>) ·
                  Total:{' '}
                  <span className="font-mono-num font-extrabold text-emerald-600">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <select
                  aria-label={`Order status for ${ord.orderNumber}`}
                  value={ord.status}
                  onChange={(e) =>
                    onUpdateOrderStatus(
                      ord.id,
                      e.target.value as CustomerOrder['status']
                    )
                  }
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Completed">Completed</option>
                </select>

                <a
                  href={`tel:${ord.customerPhone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
