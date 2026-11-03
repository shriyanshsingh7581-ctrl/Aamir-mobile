import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check, Heart } from 'lucide-react';
import { AccessoryCategory, AccessoryItem } from '../types';
import {
  filterAccessories,
  calculateDiscountPercentage,
  buildWhatsAppUrl,
} from '../utils/storeLogic';

interface AccessoriesModuleProps {
  accessories: AccessoryItem[];
  globalSearch: string;
  onAddAccessoryToCart: (item: AccessoryItem) => void;
}

const CATEGORIES: AccessoryCategory[] = [
  'All Accessories',
  'TWS Earbuds & Neckbands',
  'Fast Chargers & Adapters',
  'Data Cables',
  'Back Covers & Cases',
  'Tempered Glass',
  'Power Banks & Speakers',
];

export const AccessoriesModule: React.FC<AccessoriesModuleProps> = ({
  accessories,
  globalSearch,
  onAddAccessoryToCart,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<AccessoryCategory>('All Accessories');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const filteredItems = filterAccessories(
    accessories,
    selectedCategory,
    globalSearch
  );

  const handleAddClick = (item: AccessoryItem) => {
    onAddAccessoryToCart(item);
    setRecentlyAddedId(item.id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === item.id ? null : prev));
    }, 1200);
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="accessories-section"
      className="py-8 lg:py-10 bg-[#f8fafc] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Charlie Mobile Styled Accessories Header & Horizontal Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="py-4 px-4 sm:px-6 text-center border-b border-slate-200">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ea580c]">
              03 · Original Mobile Accessories &amp; Smart Gadgets
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Neckbands, ANC Earbuds, 65W/80W Chargers, Covers &amp; Glass
            </h2>
          </div>

          <div className="flex items-center overflow-x-auto no-scrollbar bg-slate-50/70 border-b border-slate-200">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`py-3 px-4 text-xs sm:text-sm font-extrabold border-r border-slate-200 whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === category
                    ? 'bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Charlie Mobile Style Product Cards */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-base font-bold text-slate-900">
              No accessories match your filter
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All Accessories')}
              className="mt-3 px-4 py-2 text-xs font-bold bg-[#ea580c] text-white rounded-lg"
            >
              Show All Accessories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const discount = calculateDiscountPercentage(
                item.price,
                item.mrp
              );
              const isAdded = recentlyAddedId === item.id;
              const isWishlisted = wishlistIds.includes(item.id);
              const waOrderText = `Hello Aamir Mobile Dhampur! I want to order *${item.name}* (${item.category}) listed at ₹${item.price.toLocaleString('en-IN')}.`;

              return (
                <article
                  key={item.id}
                  className="bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-[#ea580c] p-4 flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                        {item.discountLabel || `${discount}% OFF`}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.id)}
                        aria-label={`Wishlist ${item.name}`}
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

                    {/* Centered Product Visual */}
                    <div className="relative h-40 w-full bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mx-auto hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] truncate">
                        {item.brand}
                      </p>

                      <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.specs}
                      </p>

                      <div className="pt-2 flex flex-wrap items-baseline gap-2">
                        <span className="font-mono-num text-lg font-extrabold text-emerald-600">
                          ₹ {item.price.toLocaleString('en-IN')}
                        </span>
                        <span className="font-mono-num text-xs text-slate-400 line-through">
                          ₹ {item.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-extrabold text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">
                          {item.discountLabel || `${discount}% OFF`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleAddClick(item)}
                      className={`w-full py-2 min-h-[38px] text-xs font-extrabold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#ea580c] hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Added to Cart ✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <a
                      href={buildWhatsAppUrl(waOrderText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 min-h-[36px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Order on WhatsApp (9897060816)</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
