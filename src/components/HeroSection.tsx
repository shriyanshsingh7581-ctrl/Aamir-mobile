import React, { useState } from 'react';
import {
  Smartphone,
  Banknote,
  Microscope,
  Headphones,
  PhoneCall,
  MessageCircle,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import {
  CHARLIE_HERO_BANNERS,
  SUPPORTED_BRANDS,
} from '../data/initialData';
import {
  PRIMARY_PHONE_DISPLAY,
  SECONDARY_PHONE_DISPLAY,
  SHOP_ADDRESS,
  buildWhatsAppUrl,
} from '../utils/storeLogic';

interface HeroSectionProps {
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
  onQuickAction: (
    action: 'buy-phones' | 'sell-scrap' | 'book-repair' | 'shop-accessories'
  ) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  globalSearch,
  onGlobalSearchChange,
  onQuickAction,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? CHARLIE_HERO_BANNERS.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === CHARLIE_HERO_BANNERS.length - 1 ? 0 : prev + 1
    );
  };

  const currentBanner = CHARLIE_HERO_BANNERS[activeSlide];

  return (
    <section id="top" className="bg-[#f8fafc] border-b border-slate-200 pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 space-y-5">
        {/* 1. Charlie Mobile Dark Navy Official Store Banner (Customer Only — No Admin Button) */}
        <div className="bg-[#161f30] text-white rounded-2xl p-3.5 sm:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-md border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ea580c] to-amber-500 flex items-center justify-center font-display font-extrabold text-lg text-white shrink-0 shadow">
              AM
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-bold text-sm sm:text-base text-white">
                  AAMIR MOBILE DHAMPUR
                </span>
                <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded uppercase tracking-wider">
                  SALES · IC REPAIR · 2ND-HAND &amp; SCRAP HUB
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400 inline mr-1" />
                {SHOP_ADDRESS} · Call:{' '}
                <a
                  href="tel:+919897060816"
                  className="text-amber-300 font-mono-num font-bold hover:underline"
                >
                  {PRIMARY_PHONE_DISPLAY}
                </a>{' '}
                /{' '}
                <a
                  href="tel:+919306181811"
                  className="text-amber-300 font-mono-num font-bold hover:underline"
                >
                  {SECONDARY_PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-between lg:justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Daily: 9:30 AM – 9:00 PM</span>
            </span>

            <a
              href={buildWhatsAppUrl(
                'Hello Aamir Mobile Dhampur! I want to enquire about 4G/5G phones, repair or accessories.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp 9897060816</span>
            </a>
          </div>
        </div>

        {/* 2. Charlie Mobile Festive Deals Strip Banner */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
          <img
            src="https://img-prd-pim.poorvika.com/pageimg/Festive-Deals-Offers-2027-M.webp"
            alt="Aamir Mobile Dhampur Festive Deals & Super Saver Offers"
            referrerPolicy="no-referrer"
            className="w-full h-20 sm:h-28 object-cover object-center"
          />
        </div>

        {/* 3. Charlie Mobile Hero Banner Carousel + Official Visiting Card Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left 8 Cols: Interactive Charlie Mobile Banner Carousel */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between relative">
            <div className="relative h-56 sm:h-72 lg:h-[310px] bg-slate-900 overflow-hidden">
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              {/* Left / Right Carousel Controls */}
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous promotional banner"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next promotional banner"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <span className="inline-block bg-[#ea580c] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">
                    Aapki Needs Hamari Priority
                  </span>
                  <h1 className="font-display text-base sm:text-xl font-extrabold leading-snug">
                    Dhampur&apos;s #1 Mobile Hub — Buy &amp; Sell 4G/5G Phones,
                    Sell Dead/Scrap Phones, IC-Level Microscope Repair &amp;
                    Original Accessories
                  </h1>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Dots + Live Search Bar */}
            <div className="p-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {CHARLIE_HERO_BANNERS.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Show banner slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === idx
                        ? 'w-7 bg-[#ea580c]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <div className="w-full sm:w-auto flex-1 max-w-md flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
                <Search className="w-4 h-4 text-[#ea580c] mr-2 shrink-0" />
                <label htmlFor="global-store-search" className="sr-only">
                  Search phones, repair services, or accessories
                </label>
                <input
                  id="global-store-search"
                  type="search"
                  value={globalSearch}
                  onChange={(e) => onGlobalSearchChange(e.target.value)}
                  placeholder="Quick filter: iPhone 13, Vivo V27, Folder price, 65W charger..."
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Official Aamir Mobile Visiting Card & Direct Call Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="relative h-52 bg-slate-950 overflow-hidden">
              <img
                src="/assets/aistudio/IMG-20261103-WA0076_244db373.jpg"
                alt="Aamir Mobile Official Visiting Card - Purana Dhampur Chungi, Kalagarh Road, Dhampur"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                <div>
                  <p className="text-[11px] font-bold text-amber-400">
                    Purana Dhampur Chungi, Kalagarh Road
                  </p>
                  <p className="text-xs font-extrabold">
                    हमारे यहाँ पुराने 4G/5G मोबाईल मिलते हैं
                  </p>
                </div>
                <span className="text-[10px] font-mono-num font-bold bg-[#ea580c] text-white px-2 py-0.5 rounded">
                  U.P. 246761
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+919897060816"
                  className="py-2.5 px-3 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                  <span>Call 9897060816</span>
                </a>
                <a
                  href="tel:+919306181811"
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Alt: 9306181811</span>
                </a>
              </div>

              <a
                href={buildWhatsAppUrl(
                  'Hello Aamir Mobile Dhampur! I want to check today’s 4G/5G phone stock & offers.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp: +91 9897060816 (Instant Reply)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. Four Interactive Quick-Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onQuickAction('buy-phones')}
            className="group text-left bg-white hover:bg-orange-50/40 border border-slate-200 hover:border-[#ea580c] rounded-2xl p-4 transition-all flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-full">
                Verified Stock →
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                📱 Buy 2nd Hand Phones
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Verified 4G/5G Second-Hand &amp; New Phones with Bill &amp;
                Warranty
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction('sell-scrap')}
            className="group text-left bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-[#ea580c] rounded-2xl p-4 transition-all flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Instant Cash →
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                💰 Sell Used OR Dead/Scrap Phone
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Instant Cash quote for working or completely dead/broken phones
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction('book-repair')}
            className="group text-left bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-600 rounded-2xl p-4 transition-all flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Microscope className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                Get Token ID →
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                🔬 Book IC-Level Repair Appointment
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Folder/Combo, Touch, Battery, Water Damage, Motherboard IC &amp;
                Unlock
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction('shop-accessories')}
            className="group text-left bg-white hover:bg-orange-50/40 border border-slate-200 hover:border-[#ea580c] rounded-2xl p-4 transition-all flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-[#ea580c] bg-orange-50 px-2.5 py-1 rounded-full">
                Up to 67% OFF →
              </span>
            </div>
            <div className="mt-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                🎧 Shop All Accessories
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Neckbands, Earbuds, Fast Chargers, Cables, Covers, Tempered
                Glass
              </p>
            </div>
          </button>
        </div>

        {/* Supported Brands Strip */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-600">
            Authorised-Grade Parts, Sale, Purchase &amp; IC Support For:
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-extrabold text-slate-800">
            {SUPPORTED_BRANDS.map((brand, idx) => (
              <React.Fragment key={brand.name}>
                <span className="hover:text-[#ea580c] transition-colors">
                  {brand.name}
                </span>
                {idx < SUPPORTED_BRANDS.length - 1 && (
                  <span aria-hidden="true" className="text-slate-300">
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
