import React, { useRef } from 'react';
import {
  ShoppingBag,
  Smartphone,
  Wrench,
  Headphones,
  ShieldCheck,
  Home,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  Database,
} from 'lucide-react';
import { CHARLIE_CATEGORY_CIRCLES } from '../data/initialData';

interface NavbarProps {
  activeView: 'customer' | 'admin';
  onSwitchView: (view: 'customer' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  activeMobileSection: string;
  onNavigateSection: (sectionId: string) => void;
  globalSearch?: string;
  onGlobalSearchChange?: (val: string) => void;
  isFirebaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSwitchView,
  cartCount,
  onOpenCart,
  activeMobileSection,
  onNavigateSection,
  globalSearch = '',
  onGlobalSearchChange,
  isFirebaseConnected = true,
}) => {
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const offset = direction === 'left' ? -320 : 320;
    categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <>
      {/* Charlie Mobile Style Top Orange Header Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo Badge + AAMIR MOBILES & ACCESSORIES */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onSwitchView('customer');
                onNavigateSection('top');
              }}
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#ea580c] font-display font-extrabold text-base flex items-center justify-center shadow-sm border-2 border-amber-200 shrink-0">
                AM
              </div>
              <div className="leading-tight">
                <span className="block font-display font-extrabold text-base sm:text-lg tracking-tight text-white">
                  AAMIR MOBILE
                </span>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-orange-100">
                  MOBILES &amp; IC REPAIR HUB
                </span>
              </div>
            </a>
          </div>

          {/* Center: Charlie Mobile Style White Pill Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl items-center bg-white rounded-full px-4 py-1.5 shadow-inner border border-orange-300">
            <label htmlFor="header-charlie-search" className="sr-only">
              Search for Products, Brands, Offers
            </label>
            <input
              id="header-charlie-search"
              type="search"
              value={globalSearch}
              onChange={(e) => {
                onGlobalSearchChange?.(e.target.value);
                if (activeView !== 'customer') {
                  onSwitchView('customer');
                }
              }}
              placeholder="Search for Products, Brands, Offers (e.g. iPhone 13, Vivo V27, Folder, Neckband)..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {globalSearch ? (
              <button
                type="button"
                onClick={() => onGlobalSearchChange?.('')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2"
              >
                Clear
              </button>
            ) : null}
            <Search className="w-4 h-4 text-[#ea580c] shrink-0 ml-1" />
          </div>

          {/* Right: Location Pin, Call, Cart Badge & Admin Switcher */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="#shop-gallery-section"
              onClick={(e) => {
                e.preventDefault();
                onSwitchView('customer');
                onNavigateSection('shop-gallery-section');
              }}
              className="hidden lg:flex items-center gap-1.5 text-left hover:opacity-90 transition-opacity"
            >
              <div className=" leading-tight text-right">
                <span className="block text-[10px] text-orange-100">
                  Store Location
                </span>
                <span className="block text-xs font-extrabold tracking-wide text-white">
                  DHAMPUR 246761
                </span>
              </div>
              <MapPin className="w-4 h-4 text-white shrink-0" />
            </a>

            <a
              href="tel:+919897060816"
              aria-label="Call Aamir Mobile 9897060816"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>9897060816</span>
            </a>

            {/* Cart Button with Charlie Mobile Green Count Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping bag with ${cartCount} items`}
              className="relative inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-white text-slate-900 hover:bg-orange-50 text-xs font-extrabold shadow-sm transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span>Cart ({cartCount})</span>
              <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Admin / Account Button */}
            <button
              type="button"
              onClick={() =>
                onSwitchView(activeView === 'admin' ? 'customer' : 'admin')
              }
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-full text-xs font-extrabold transition-colors whitespace-nowrap border ${
                activeView === 'admin'
                  ? 'bg-slate-950 text-amber-400 border-amber-400'
                  : 'bg-slate-900/90 hover:bg-slate-950 text-white border-white/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">
                {activeView === 'admin' ? 'Exit Admin' : 'Admin (PIN: 7777)'}
              </span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (< 768px) */}
        <div className="md:hidden px-3 pb-2.5">
          <div className="flex items-center bg-white rounded-full px-3.5 py-1.5 shadow-inner">
            <label htmlFor="mobile-charlie-search" className="sr-only">
              Search for Products, Brands, Offers
            </label>
            <input
              id="mobile-charlie-search"
              type="search"
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange?.(e.target.value)}
              placeholder="Search phones, folders, IC repair, neckbands..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#ea580c] shrink-0" />
          </div>
        </div>

        {/* Sub-navigation quick links bar */}
        <div className="bg-[#c2410c] border-t border-orange-400/30 px-3 sm:px-6 lg:px-8 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar text-xs font-semibold text-orange-50">
            <nav
              aria-label="Primary Navigation"
              className="flex items-center gap-5 whitespace-nowrap"
            >
              <a
                href="#phones-section"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchView('customer');
                  onNavigateSection('phones-section');
                }}
                className="hover:text-white transition-colors"
              >
                2nd-Hand &amp; New 4G/5G Phones
              </a>
              <a
                href="#sell-scrap-section"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchView('customer');
                  onNavigateSection('sell-scrap-section');
                }}
                className="hover:text-white transition-colors font-bold text-amber-200"
              >
                💰 Sell Old OR Dead/Scrap Phone
              </a>
              <a
                href="#repair-section"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchView('customer');
                  onNavigateSection('repair-section');
                }}
                className="hover:text-white transition-colors"
              >
                🔬 Microscope IC Repair Lab
              </a>
              <a
                href="#accessories-section"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchView('customer');
                  onNavigateSection('accessories-section');
                }}
                className="hover:text-white transition-colors"
              >
                🎧 Original Accessories
              </a>
              <a
                href="#shop-gallery-section"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchView('customer');
                  onNavigateSection('shop-gallery-section');
                }}
                className="hover:text-white transition-colors"
              >
                📍 Purana Dhampur Chungi Store
              </a>
            </nav>

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-emerald-200 shrink-0">
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {isFirebaseConnected
                  ? 'Firebase Real-Time DB Active'
                  : 'Local Sync Mode'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Charlie Mobile Circular Category Icon Strip (Only on Customer View) */}
      {activeView === 'customer' && (
        <div className="bg-white border-b border-slate-200 shadow-xs relative">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 relative flex items-center">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              aria-label="Scroll categories left"
              className="hidden md:flex w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-700 hover:bg-slate-50 shrink-0 mr-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
            >
              {CHARLIE_CATEGORY_CIRCLES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigateSection(cat.targetSection)}
                  className="group flex flex-col items-center text-center w-16 sm:w-20 shrink-0 focus:outline-none"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-[#ea580c] overflow-hidden shadow-xs transition-all p-0.5">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                    />
                    {cat.badge && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <span className="mt-1.5 text-[11px] font-bold text-slate-700 group-hover:text-[#ea580c] leading-tight line-clamp-2">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories('right')}
              aria-label="Scroll categories right"
              className="hidden md:flex w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-700 hover:bg-slate-50 shrink-0 ml-2"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar for Mobile (< 768px) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white border-t border-slate-200 grid grid-cols-5 items-center px-1 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            onSwitchView('customer');
            onNavigateSection('top');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeView === 'customer' && activeMobileSection === 'top'
              ? 'text-[#ea580c] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            Home
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSwitchView('customer');
            onNavigateSection('phones-section');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeView === 'customer' &&
            (activeMobileSection === 'phones-section' ||
              activeMobileSection === 'sell-scrap-section')
              ? 'text-[#ea580c] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            Buy/Sell
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSwitchView('customer');
            onNavigateSection('repair-section');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeView === 'customer' &&
            activeMobileSection === 'repair-section'
              ? 'text-[#ea580c] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            IC Repair
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSwitchView('customer');
            onNavigateSection('accessories-section');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeView === 'customer' &&
            activeMobileSection === 'accessories-section'
              ? 'text-[#ea580c] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            Accessories
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSwitchView('admin')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeView === 'admin'
              ? 'text-[#ea580c] font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            Admin
          </span>
        </button>
      </nav>
    </>
  );
};
