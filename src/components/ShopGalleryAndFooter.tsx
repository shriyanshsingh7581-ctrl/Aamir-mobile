import React from 'react';
import {
  MapPin,
  PhoneCall,
  MessageCircle,
  Navigation,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { SUPPORTED_BRANDS } from '../data/initialData';
import {
  PRIMARY_PHONE_DISPLAY,
  SECONDARY_PHONE_DISPLAY,
  SHOP_ADDRESS,
  buildWhatsAppUrl,
} from '../utils/storeLogic';

interface ShopGalleryAndFooterProps {
  onOpenAdmin: () => void;
}

const SHOP_SHOWCASE_CARDS = [
  {
    number: '01',
    title: '1. Advanced Microscope IC Repair Lab',
    subtitle: 'Stereo Microscope · SMD Rework · DC Power Supply Diagnostics',
    description:
      'Equipped with high-precision stereo microscope, hot-air SMD rework stations, and digital short-killer tools for dead motherboard and CPU/IC repair.',
    image: '/assets/aistudio/IMG-20261103-WA0072_19e0724b.jpg',
  },
  {
    number: '02',
    title: '2. Huge Wall of Original Accessories & Earphones',
    subtitle: 'Neckbands · ANC Earbuds · 65W Chargers · Tempered Glass & Covers',
    description:
      'Complete wall showcase stocked with wireless neckbands, TWS earbuds, SuperVOOC/PD fast chargers, data cables, and shockproof cases.',
    image: '/assets/aistudio/IMG-20261103-WA0074_db4f0c7f.jpg',
  },
  {
    number: '03',
    title: '3. Verified 4G/5G Second-Hand Phone Counter',
    subtitle: 'पुराने 4G एवं 5G मोबाईल · Buy, Sell & Instant Cash Exchange',
    description:
      'Dedicated counter at Purana Dhampur Chungi for buying verified 4G/5G smartphones and selling old or dead/scrap phones for instant cash.',
    image: '/assets/aistudio/IMG-20261103-WA0073_c06ef73d.jpg',
  },
  {
    number: '04',
    title: '4. Customer Waiting Area',
    subtitle: 'Live Transparent Front-of-Customer Repair Experience',
    description:
      'Comfortable customer seating inside Aamir Mobile Dhampur where you can watch your folder replacement or IC diagnostic performed live.',
    image: '/assets/aistudio/IMG-20261103-WA0071_f1c06291.jpg',
  },
];

export const ShopGalleryAndFooter: React.FC<ShopGalleryAndFooterProps> = ({
  onOpenAdmin,
}) => {
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Purana+Dhampur+Chungi+Kalagarh+Road+Dhampur+Bijnor+UP+246761';

  return (
    <>
      {/* Inside Aamir Mobile Dhampur Showcase Section */}
      <section
        id="shop-gallery-section"
        className="py-8 lg:py-12 bg-[#f8fafc] border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ea580c]">
                04 · Real Store &amp; Lab Tour
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Inside Aamir Mobile Dhampur
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
                Real photographs from our shop at Purana Dhampur Chungi,
                Kalagarh Road, Dhampur (Bijnor) — 100% transparent service.
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-extrabold rounded-xl transition-colors self-start md:self-auto whitespace-nowrap shadow-xs"
            >
              <Navigation className="w-4 h-4 shrink-0" />
              <span>Open Kalagarh Road Location on Google Maps</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOP_SHOWCASE_CARDS.map((card) => (
              <article
                key={card.number}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative h-56 bg-slate-950 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 font-mono-num text-xs font-extrabold bg-[#ea580c] text-white px-2.5 py-0.5 rounded">
                      {card.number}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <p className="text-[11px] font-extrabold text-[#ea580c]">
                      {card.subtitle}
                    </p>
                    <h3 className="font-display text-base font-extrabold text-slate-900">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Charlie Mobile + Aamir Mobile Visiting Card Multi-Column Footer */}
      <footer className="bg-white border-t border-slate-200 pt-10 pb-24 md:pb-12 text-slate-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
          {/* Visiting Card Styled Luxury Highlight Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#090d16] via-[#0e172a] to-[#1d4ed8]/30 border-2 border-amber-400 p-6 sm:p-8 text-white shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ea580c] to-amber-500 border-2 border-white flex items-center justify-center shrink-0 shadow-md">
                    <span className="font-display font-extrabold text-xl text-white">
                      AM
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold italic text-amber-300">
                      &ldquo;Aapki Needs Hamari Priority&rdquo;
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                      AAMIR MOBILE
                    </h2>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-white bg-[#ea580c] px-2.5 py-0.5 rounded inline-block mt-1">
                      SALES | SERVICE | ACCESSORIES
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  New &amp; Second-Hand 4G/5G Phones · Dead &amp; Scrap Phone
                  Buyers · Microscope IC-Level Repairing · All Original Mobile
                  Accessories · Software &amp; Country Unlocking.
                </p>
              </div>

              <div className="lg:col-span-4 space-y-2 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <p className="text-xs font-bold text-amber-400">
                  Direct Contact &amp; WhatsApp Numbers:
                </p>
                <a
                  href="tel:+919897060816"
                  className="flex items-center gap-2 text-base font-mono-num font-extrabold text-white hover:text-amber-400"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{PRIMARY_PHONE_DISPLAY} (Primary WhatsApp)</span>
                </a>
                <a
                  href="tel:+919306181811"
                  className="flex items-center gap-2 text-base font-mono-num font-extrabold text-white hover:text-amber-400"
                >
                  <PhoneCall className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{SECONDARY_PHONE_DISPLAY}</span>
                </a>
                <p className="text-xs text-slate-300 flex items-start gap-1.5 pt-1">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{SHOP_ADDRESS}</span>
                </p>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-2.5 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps Direction</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Store Admin Login (PIN: 7777)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Charlie Mobile Multi-Column Directory Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Contact Information
              </h3>
              <p className="font-bold text-slate-800">Head Office / Showroom</p>
              <p className="text-slate-600 leading-relaxed">
                Aamir Mobile (AM) — Sales, Service &amp; Accessories,{' '}
                {SHOP_ADDRESS}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Daily 9:30 AM – 9:00 PM</span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Core Services
              </h3>
              <ul className="space-y-1.5 text-slate-600">
                <li>Buy Verified 2nd-Hand 4G/5G Phones</li>
                <li>Sell Old OR Dead/Scrap Phones</li>
                <li>Microscope IC-Level Motherboard Repair</li>
                <li>Original AMOLED Folder &amp; OCA Glass</li>
                <li>Software &amp; Country Unlocking</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Supported Brands
              </h3>
              <ul className="space-y-1.5 text-slate-600">
                {SUPPORTED_BRANDS.map((b) => (
                  <li key={b.name}>{b.name}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Store Policies
              </h3>
              <ul className="space-y-1.5 text-slate-600">
                <li>32-Point Pre-Owned Phone Check</li>
                <li>Testing &amp; Folder Fitting Warranty</li>
                <li>100% Transparent Front-of-Customer Lab</li>
                <li>Instant Hand-to-Hand Scrap Cash</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Payment &amp; EMI Options
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-bold text-slate-800">
                  UPI / GPay / PhonePe
                </span>
                <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-bold text-slate-800">
                  CASH AT STORE
                </span>
                <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-bold text-slate-800">
                  BAJAJ FINSERV
                </span>
                <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-bold text-slate-800">
                  HDFC / RuPay / VISA
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} AAMIR MOBILE (AM) · Purana Dhampur
              Chungi, Kalagarh Road, Dhampur (Bijnor) U.P. 246761
            </p>
            <p className="font-semibold text-emerald-700">
              Powered by Real-Time Firebase Firestore Sync
            </p>
          </div>
        </div>
      </footer>

      {/* Charlie Mobile Floating Bottom-Right WhatsApp & Call Widgets */}
      <div className="fixed bottom-16 md:bottom-5 right-4 z-30 flex items-center gap-2">
        <a
          href={buildWhatsAppUrl(
            'Hello Aamir Mobile Dhampur! I want to place an order / enquiry on WhatsApp.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Order on WhatsApp</span>
        </a>
        <a
          href="tel:+919897060816"
          aria-label="Call Aamir Mobile Store"
          className="w-10 h-10 rounded-full bg-[#ea580c] hover:bg-orange-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <PhoneCall className="w-4 h-4" />
        </a>
      </div>
    </>
  );
};
