import React, { useState } from 'react';
import {
  Smartphone,
  MessageCircle,
  ShoppingBag,
  Upload,
  CheckCircle2,
  AlertCircle,
  Store,
  Sparkles,
  Wrench,
  Heart,
} from 'lucide-react';
import {
  SecondHandPhone,
  SellMode,
  SellPhoneLead,
  ScrapFaultCondition,
} from '../types';
import { CHARLIE_PROMO_COLLAGE } from '../data/initialData';
import {
  calculateDiscountPercentage,
  filterPhones,
  validateSellPhoneLeadInput,
  buildWhatsAppUrl,
  formatSellLeadWhatsAppMessage,
} from '../utils/storeLogic';

interface PhonesModuleProps {
  phones: SecondHandPhone[];
  globalSearch: string;
  activeTab: 'buy' | 'sell';
  onTabChange: (tab: 'buy' | 'sell') => void;
  initialSellMode?: SellMode;
  onAddPhoneToCart: (phone: SecondHandPhone) => void;
  onCreateSellLead: (lead: SellPhoneLead) => void;
}

const BRAND_FILTERS = [
  'All Brands',
  'Apple',
  'Samsung',
  'Vivo',
  'Oppo',
  'Realme',
  'Xiaomi Mi',
  'OnePlus',
];

const SCRAP_FAULT_OPTIONS: ScrapFaultCondition[] = [
  "Dead / Won't Turn On",
  'Broken Display + Body',
  'Water Damaged Dead',
  'Motherboard IC Short / No Network',
];

const WORKING_CONDITIONS = [
  'Like New / Scratchless (100% Working)',
  'Good Condition (Minor Usage Marks)',
  'Single Fault / Needs Minor Repair',
];

export const PhonesModule: React.FC<PhonesModuleProps> = ({
  phones,
  globalSearch,
  activeTab,
  onTabChange,
  initialSellMode = 'scrap',
  onAddPhoneToCart,
  onCreateSellLead,
}) => {
  const [brandFilter, setBrandFilter] = useState<string>('All Brands');
  const [networkFilter, setNetworkFilter] = useState<'ALL' | '5G' | '4G'>('ALL');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [storeVisitPhone, setStoreVisitPhone] =
    useState<SecondHandPhone | null>(null);

  // Sell / Scrap Form State
  const [sellMode, setSellMode] = useState<SellMode>(initialSellMode);
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('');
  const [ramStorage, setRamStorage] = useState('8GB / 128GB');
  const [workingCondition, setWorkingCondition] = useState(
    WORKING_CONDITIONS[0]
  );
  const [scrapFault, setScrapFault] = useState<ScrapFaultCondition>(
    SCRAP_FAULT_OPTIONS[0]
  );
  const [boxBillAvailable, setBoxBillAvailable] = useState(true);
  const [expectedPrice, setExpectedPrice] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<SellPhoneLead | null>(
    null
  );

  const filteredPhones = filterPhones(
    phones,
    globalSearch,
    brandFilter,
    networkFilter
  );

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numericPrice = Number(expectedPrice);
    const conditionOrFault =
      sellMode === 'scrap' ? scrapFault : workingCondition;

    const validation = validateSellPhoneLeadInput({
      mode: sellMode,
      brand,
      model,
      conditionOrFault,
      expectedPrice: numericPrice,
      customerName,
      customerPhone,
    });

    if (!validation.valid) {
      setFormError(validation.error || 'Please check your form details.');
      return;
    }

    const newLead: SellPhoneLead = {
      id: `lead-${Date.now()}`,
      mode: sellMode,
      brand: brand.trim(),
      model: model.trim(),
      ramStorage: sellMode === 'working' ? ramStorage : undefined,
      conditionOrFault,
      boxBillAvailable: sellMode === 'working' ? boxBillAvailable : undefined,
      expectedPrice: numericPrice,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      photoPreviewUrl: photoPreviewUrl || undefined,
      createdAt: 'Just now',
      status: 'New Lead',
    };

    onCreateSellLead(newLead);
    setSubmittedLead(newLead);
    setModel('');
    setExpectedPrice('');
  };

  return (
    <section
      id="phones-section"
      className="py-8 lg:py-10 bg-[#f8fafc] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Charlie Mobile Style Section Title & Segmented Underline Tab Bar */}
        <div
          id="sell-scrap-section"
          className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="py-4 px-4 sm:px-6 text-center border-b border-slate-200">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ea580c]">
              01 · Aamir Mobile Dhampur — Mobiles &amp; Scrap Hub
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Mobiles &amp; 2nd-Hand / Scrap Phone Hub
            </h2>
          </div>

          {/* Charlie Mobile Horizontal Tab Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 bg-slate-50/70">
            <button
              type="button"
              onClick={() => {
                onTabChange('buy');
                setNetworkFilter('ALL');
              }}
              className={`py-3.5 px-3 text-xs sm:text-sm font-extrabold border-r border-slate-200 transition-colors ${
                activeTab === 'buy' && networkFilter === 'ALL'
                  ? 'bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Best Seller 4G &amp; 5G ({phones.length})
            </button>

            <button
              type="button"
              onClick={() => {
                onTabChange('buy');
                setNetworkFilter('5G');
              }}
              className={`py-3.5 px-3 text-xs sm:text-sm font-extrabold border-r border-slate-200 transition-colors ${
                activeTab === 'buy' && networkFilter === '5G'
                  ? 'bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              5G Mobiles Only
            </button>

            <button
              type="button"
              onClick={() => {
                onTabChange('buy');
                setNetworkFilter('4G');
              }}
              className={`py-3.5 px-3 text-xs sm:text-sm font-extrabold border-r border-slate-200 transition-colors ${
                activeTab === 'buy' && networkFilter === '4G'
                  ? 'bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              4G Budget Phones
            </button>

            <button
              type="button"
              onClick={() => onTabChange('sell')}
              className={`py-3.5 px-3 text-xs sm:text-sm font-extrabold transition-colors ${
                activeTab === 'sell'
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-amber-50 text-[#ea580c] hover:bg-amber-100'
              }`}
            >
              💰 Sell Old OR Dead/Scrap Phone
            </button>
          </div>

          {/* Charlie Mobile 5-Banner Promo Collage (Visible on Buy Tab) */}
          {activeTab === 'buy' && (
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-6 rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={CHARLIE_PROMO_COLLAGE.mainBanner}
                    alt="Samsung 5G & Flagship Smartphone Deals at Aamir Mobile"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 sm:h-56 object-cover"
                  />
                </div>
                <div className="lg:col-span-6 grid grid-cols-2 gap-3">
                  {CHARLIE_PROMO_COLLAGE.gridBanners.map((tile) => (
                    <div
                      key={tile.title}
                      className="rounded-xl overflow-hidden border border-slate-200 bg-white h-24 sm:h-[106px]"
                    >
                      <img
                        src={tile.image}
                        alt={tile.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: BUY SECOND-HAND / REFURBISHED 4G & 5G PHONES */}
        {activeTab === 'buy' && (
          <div className="space-y-5">
            {/* Brand Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {BRAND_FILTERS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrandFilter(b)}
                    className={`px-3.5 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      brandFilter === b
                        ? 'bg-[#ea580c] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onTabChange('sell')}
                className="text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                पुराना या डेड/स्क्रैप फोन बेचें →
              </button>
            </div>

            {/* Charlie Mobile 4-Column White Bordered Product Grid */}
            {filteredPhones.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
                <p className="text-base font-bold text-slate-900">
                  No matching second-hand phones found
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search or selecting &ldquo;All Brands&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBrandFilter('All Brands');
                    setNetworkFilter('ALL');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold bg-[#ea580c] text-white rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPhones.map((phone) => {
                  const discount = calculateDiscountPercentage(
                    phone.price,
                    phone.mrp
                  );
                  const isWishlisted = wishlistIds.includes(phone.id);
                  const waMessage = `Hello Aamir Mobile! I want to enquire about buying the Second-Hand *${phone.brand} ${phone.model}* (${phone.ramStorage}, Battery ${phone.batteryHealth}%) listed at ₹${phone.price.toLocaleString('en-IN')}. Is it available at Purana Dhampur Chungi shop?`;

                  return (
                    <article
                      key={phone.id}
                      className="bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-[#ea580c] p-4 flex flex-col justify-between transition-all hover:shadow-md relative"
                    >
                      <div>
                        {/* Top Badges + Charlie Mobile Heart Wishlist Button */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-orange-50 text-[#ea580c] border border-orange-200 px-2 py-0.5 rounded">
                            {phone.conditionBadge} · {phone.network}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(phone.id)}
                            aria-label={`Wishlist ${phone.brand} ${phone.model}`}
                            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                              isWishlisted
                                ? 'bg-red-50 border-red-200 text-red-500'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'
                            }`}
                          >
                            <Heart
                              className="w-3.5 h-3.5"
                              fill={isWishlisted ? 'currentColor' : 'none'}
                            />
                          </button>
                        </div>

                        {/* Centered Product Image (Charlie Mobile Card Style) */}
                        <div className="relative h-44 w-full bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-3">
                          <img
                            src={phone.image}
                            alt={`${phone.brand} ${phone.model} - ${phone.ramStorage}`}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain mx-auto hover:scale-105 transition-transform duration-200"
                          />
                          <span className="absolute bottom-1.5 right-2 text-[10px] font-mono-num font-bold bg-slate-900/85 text-amber-300 px-2 py-0.5 rounded">
                            Battery {phone.batteryHealth}%
                          </span>
                        </div>

                        {/* Charlie Mobile Title & Specs */}
                        <div className="space-y-1">
                          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                            {phone.brand} {phone.model}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            ({phone.color}, {phone.ramStorage})
                          </p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 pt-0.5">
                            {phone.verifiedNote}
                          </p>

                          {/* Charlie Mobile Green Price + Strikethrough MRP + % OFF */}
                          <div className="pt-2 flex flex-wrap items-baseline gap-2">
                            <span className="font-mono-num text-lg font-extrabold text-emerald-600">
                              ₹ {phone.price.toLocaleString('en-IN')}
                            </span>
                            <span className="font-mono-num text-xs text-slate-400 line-through">
                              ₹ {phone.mrp.toLocaleString('en-IN')}
                            </span>
                            {discount > 0 && (
                              <span className="text-[11px] font-extrabold text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={buildWhatsAppUrl(waMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-2 min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                          >
                            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>WhatsApp Buy</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => onAddPhoneToCart(phone)}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-2 min-h-[38px] bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                            <span>Add to Cart</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStoreVisitPhone(phone)}
                          className="w-full py-1.5 min-h-[34px] text-xs font-bold text-slate-700 hover:text-[#ea580c] bg-slate-100 hover:bg-orange-50 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Store className="w-3.5 h-3.5 shrink-0" />
                          <span>Book Store Visit to Check Live</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SELL YOUR OLD PHONE OR SCRAP / DEAD PHONE */}
        {activeTab === 'sell' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Mode Selector & Interactive Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#ea580c] mb-2">
                  Select Phone Condition Category:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSellMode('working');
                      setSubmittedLead(null);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      sellMode === 'working'
                        ? 'bg-orange-50/70 border-[#ea580c] text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900">
                        Mode A: Working 2nd-Hand Phone
                      </span>
                      <Smartphone className="w-4 h-4 text-[#ea580c] shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Sell or exchange your working 4G/5G phone for instant cash
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSellMode('scrap');
                      setSubmittedLead(null);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      sellMode === 'scrap'
                        ? 'bg-amber-50 border-[#ea580c] text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#ea580c]">
                        Mode B: Scrap / Dead / Broken Phone
                      </span>
                      <Wrench className="w-4 h-4 text-[#ea580c] shrink-0" />
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      स्क्रैप या बिल्कुल खत्म/डेड फोन बेचें — Best Spare Value
                    </p>
                  </button>
                </div>
              </div>

              {sellMode === 'scrap' && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 text-xs sm:text-sm flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-900">
                      We buy completely dead, motherboard-fault, screen-crushed,
                      or scrap phones for best spare/scrap value!
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      अगर आपका फोन बिल्कुल डेड है, पानी में गिर गया है, या बोर्ड
                      खराब है — आमिर मोबाइल धामपुर पर तुरंत नकद (Instant Cash)
                      पाएं।
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSellSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sell-brand"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Mobile Brand
                    </label>
                    <select
                      id="sell-brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#ea580c] focus:outline-none"
                    >
                      <option value="Apple">Apple iPhone</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Vivo">Vivo</option>
                      <option value="Oppo">Oppo</option>
                      <option value="Xiaomi Mi">Xiaomi / Redmi / Poco</option>
                      <option value="Realme">Realme</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Other">Other Brand</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="sell-model"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Phone Model Name *
                    </label>
                    <input
                      id="sell-model"
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g., Galaxy A52 / iPhone 11 / Redmi Note 10"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                    />
                  </div>
                </div>

                {sellMode === 'working' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="sell-ram"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        RAM / Storage
                      </label>
                      <select
                        id="sell-ram"
                        value={ramStorage}
                        onChange={(e) => setRamStorage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#ea580c] focus:outline-none"
                      >
                        <option value="4GB / 64GB">4GB / 64GB</option>
                        <option value="6GB / 128GB">6GB / 128GB</option>
                        <option value="8GB / 128GB">8GB / 128GB</option>
                        <option value="8GB / 256GB">8GB / 256GB</option>
                        <option value="12GB / 256GB">12GB / 256GB</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="sell-working-cond"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        Screen &amp; Body Condition
                      </label>
                      <select
                        id="sell-working-cond"
                        value={workingCondition}
                        onChange={(e) => setWorkingCondition(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#ea580c] focus:outline-none"
                      >
                        {WORKING_CONDITIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="sell-scrap-fault"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Scrap / Dead Phone Fault Condition *
                    </label>
                    <select
                      id="sell-scrap-fault"
                      value={scrapFault}
                      onChange={(e) =>
                        setScrapFault(e.target.value as ScrapFaultCondition)
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#ea580c] focus:outline-none"
                    >
                      {SCRAP_FAULT_OPTIONS.map((fault) => (
                        <option key={fault} value={fault}>
                          {fault}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {sellMode === 'working' && (
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      id="sell-box-bill"
                      type="checkbox"
                      checked={boxBillAvailable}
                      onChange={(e) => setBoxBillAvailable(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <label
                      htmlFor="sell-box-bill"
                      className="text-xs font-medium text-slate-700"
                    >
                      Original Box, Charger, or GST Bill Available (Gets Higher
                      Price)
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sell-expected-price"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      {sellMode === 'scrap'
                        ? 'Expected Scrap Value (₹) *'
                        : 'Expected Selling Price (₹) *'}
                    </label>
                    <input
                      id="sell-expected-price"
                      type="number"
                      min="100"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder={
                        sellMode === 'scrap' ? 'e.g., 1500' : 'e.g., 12500'
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono-num placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sell-photo-upload"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Upload Phone Photo (Optional Preview)
                    </label>
                    <label
                      htmlFor="sell-photo-upload"
                      className="w-full min-h-[42px] bg-slate-50 border border-dashed border-slate-300 hover:border-[#ea580c] rounded-xl px-3.5 py-2 text-xs text-slate-700 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#ea580c] shrink-0" />
                      <span className="truncate">
                        {photoPreviewUrl
                          ? 'Photo Attached ✓'
                          : 'Choose Phone Image'}
                      </span>
                      <input
                        id="sell-photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sell-customer-name"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="sell-customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sell-customer-phone"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      id="sell-customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono-num placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                    />
                  </div>
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 min-h-[48px] bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {sellMode === 'scrap'
                      ? 'Submit Scrap/Dead Phone & Get Instant Cash Quote'
                      : 'Submit Old Phone & Get Instant Valuation'}
                  </span>
                </button>
              </form>
            </div>

            {/* Right Column: Confirmation / Instant Scrap Rate Guide */}
            <div className="lg:col-span-5 space-y-6">
              {submittedLead ? (
                <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold text-emerald-700">
                        Synced to Firebase &amp; Admin Desk
                      </p>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Sell Request Registered!
                      </h3>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 text-slate-700">
                    <p>
                      <strong className="text-slate-900">Category:</strong>{' '}
                      {submittedLead.mode === 'scrap'
                        ? 'Scrap / Dead Phone'
                        : 'Working Second-Hand Phone'}
                    </p>
                    <p>
                      <strong className="text-slate-900">Device:</strong>{' '}
                      {submittedLead.brand} {submittedLead.model}
                    </p>
                    <p>
                      <strong className="text-slate-900">
                        Condition/Fault:
                      </strong>{' '}
                      {submittedLead.conditionOrFault}
                    </p>
                    <p>
                      <strong className="text-slate-900">Expected Cash:</strong>{' '}
                      <span className="font-mono-num text-emerald-700 font-extrabold">
                        ₹{submittedLead.expectedPrice.toLocaleString('en-IN')}
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-900">Customer:</strong>{' '}
                      {submittedLead.customerName} (
                      {submittedLead.customerPhone})
                    </p>
                  </div>

                  <a
                    href={buildWhatsAppUrl(
                      formatSellLeadWhatsAppMessage(submittedLead)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Send Details on WhatsApp (9897060816) Now</span>
                  </a>
                </div>
              ) : null}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="font-display text-lg font-extrabold text-slate-900">
                  Why Sell Old or Scrap Phones at Aamir Mobile Dhampur?
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-num font-extrabold text-[#ea580c]">
                      01.
                    </span>
                    <span>
                      <strong className="text-slate-900">
                        Dead &amp; Motherboard-Fault Buyers:
                      </strong>{' '}
                      Because we run an in-house IC-level repair lab, we pay the
                      highest value in Bijnor district for dead, broken-folder,
                      or water-damaged scrap phones.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-num font-extrabold text-[#ea580c]">
                      02.
                    </span>
                    <span>
                      <strong className="text-slate-900">
                        Instant Cash or Upgrade Exchange:
                      </strong>{' '}
                      Get hand-to-hand cash or exchange your dead/old phone for
                      a verified 5G phone at Purana Dhampur Chungi.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-num font-extrabold text-[#ea580c]">
                      03.
                    </span>
                    <span>
                      <strong className="text-slate-900">
                        100% Safe Data Wipe:
                      </strong>{' '}
                      Complete factory reset &amp; eMMC data formatting in front
                      of you.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Store Visit Modal */}
        {storeVisitPhone && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-visit-modal-title"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold text-[#ea580c]">
                    Reserve for Live Store Check
                  </p>
                  <h3
                    id="store-visit-modal-title"
                    className="text-lg font-extrabold text-slate-900 mt-0.5"
                  >
                    {storeVisitPhone.brand} {storeVisitPhone.model}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreVisitPhone(null)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900">
                    Aamir Mobile Price:
                  </strong>{' '}
                  <span className="font-mono-num text-emerald-600 font-extrabold">
                    ₹{storeVisitPhone.price.toLocaleString('en-IN')}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-900">Specs:</strong>{' '}
                  {storeVisitPhone.ramStorage} · Battery{' '}
                  {storeVisitPhone.batteryHealth}%
                </p>
                <p>
                  <strong className="text-slate-900">Shop Address:</strong>{' '}
                  Purana Dhampur Chungi, Kalagarh Road, Dhampur (Bijnor)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={buildWhatsAppUrl(
                    `Hello Aamir Mobile! Please hold *${storeVisitPhone.brand} ${storeVisitPhone.model}* (₹${storeVisitPhone.price.toLocaleString('en-IN')}) for my store visit today at Purana Dhampur Chungi.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 min-h-[42px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm Visit on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setStoreVisitPhone(null)}
                  className="px-4 py-2.5 min-h-[42px] bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
