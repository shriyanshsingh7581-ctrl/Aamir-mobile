import React, { useState } from 'react';
import {
  Microscope,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Calendar,
  Wrench,
} from 'lucide-react';
import { RepairAppointment, RepairService } from '../types';
import { REPAIR_SERVICES_CATALOGUE } from '../data/initialData';
import {
  generateRepairTokenId,
  validateRepairBookingInput,
  buildWhatsAppUrl,
  formatRepairWhatsAppMessage,
} from '../utils/storeLogic';

interface RepairModuleProps {
  appointmentsCount: number;
  onCreateAppointment: (appointment: RepairAppointment) => void;
  globalSearch: string;
}

const TIME_SLOTS = [
  'Today Morning (10:00 AM – 1:00 PM)',
  'Today Afternoon (1:00 PM – 5:00 PM)',
  'Today Evening (5:00 PM – 8:30 PM)',
  'Tomorrow Morning (10:00 AM – 1:00 PM)',
  'Tomorrow Afternoon (1:00 PM – 5:00 PM)',
];

export const RepairModule: React.FC<RepairModuleProps> = ({
  appointmentsCount,
  onCreateAppointment,
  globalSearch,
}) => {
  const [brandModel, setBrandModel] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([
    REPAIR_SERVICES_CATALOGUE[0].title,
  ]);
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[0]);
  const [serviceType, setServiceType] = useState<
    'Visit Dhampur Shop' | 'Local Pickup Enquiry'
  >('Visit Dhampur Shop');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] =
    useState<RepairAppointment | null>(null);

  const q = globalSearch.trim().toLowerCase();
  const filteredServices = REPAIR_SERVICES_CATALOGUE.filter(
    (s) =>
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.highlights.some((h) => h.toLowerCase().includes(q))
  );

  const handleSelectServiceForBooking = (service: RepairService) => {
    setConfirmedBooking(null);
    if (!selectedIssues.includes(service.title)) {
      setSelectedIssues((prev) => [...prev, service.title]);
    }
    const formEl = document.getElementById('repair-booking-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleIssueSelection = (title: string) => {
    setSelectedIssues((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const validation = validateRepairBookingInput({
      brandModel,
      issues: selectedIssues,
      preferredSlot,
      customerName,
      customerPhone,
    });

    if (!validation.valid) {
      setBookingError(validation.error || 'Please fill all required fields.');
      return;
    }

    const tokenId = generateRepairTokenId(appointmentsCount);
    const newBooking: RepairAppointment = {
      id: `rep-${Date.now()}`,
      tokenId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      brandModel: brandModel.trim(),
      issues: selectedIssues,
      preferredSlot,
      serviceType,
      status: 'Pending',
      createdAt: 'Just now',
    };

    onCreateAppointment(newBooking);
    setConfirmedBooking(newBooking);
    setBrandModel('');
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <section
      id="repair-section"
      className="py-8 lg:py-10 bg-[#f8fafc] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Highlight Banner with Real Microscope Lab Photo */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ea580c]">
                  02 · IC-Level &amp; General Mobile Repair Lab
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                  Advanced Microscope IC-Level Repair Lab — 100% Satisfaction
                  &amp; Warranty Available
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  From dead motherboards, CPU/Power/Network IC reballing, and
                  water-damage shorting removal to original AMOLED folder fitting
                  and OCA glass lamination — repaired live at Purana Dhampur
                  Chungi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-2">
                <span className="inline-flex items-center gap-1.5 font-extrabold text-[#ea580c]">
                  <Microscope className="w-4 h-4" />
                  <span>Stereo Microscope &amp; SMD Rework Lab</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Genuine Spare Parts &amp; Warranty</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Express 30-Min Hand-to-Hand Service</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 relative h-52 lg:h-auto max-h-[240px] bg-slate-950 overflow-hidden">
              <img
                src="/assets/aistudio/IMG-20261103-WA0072_19e0724b.jpg"
                alt="Aamir Mobile Dhampur Real Microscope IC Repair Workbench"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <span className="absolute bottom-3 right-3 text-[11px] font-bold bg-[#ea580c] text-white px-2.5 py-1 rounded-md shadow">
                Real Lab @ Aamir Mobile Dhampur
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: 7 Repair Services Grid (Left 7 cols) + Interactive Booking Form (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Repair Services Catalogue */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
              <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                Repair Services &amp; Starting Rate Card ({filteredServices.length})
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Click any service to add to booking
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map((service, idx) => {
                const isSelected = selectedIssues.includes(service.title);
                return (
                  <article
                    key={service.id}
                    className={`rounded-xl p-4 bg-white border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-[#ea580c] shadow-sm'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono-num font-extrabold text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded">
                          0{idx + 1} · {service.shortCode}
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                          {service.estimatedTime}
                        </span>
                      </div>

                      <h4 className="font-display text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {service.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500">
                        {service.highlights.map((h, i) => (
                          <React.Fragment key={h}>
                            <span>{h}</span>
                            {i < service.highlights.length - 1 && (
                              <span aria-hidden="true">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                          Starting At
                        </span>
                        <span className="font-mono-num text-lg font-extrabold text-emerald-600">
                          ₹ {service.startingPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectServiceForBooking(service)}
                        className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-extrabold transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#ea580c] hover:bg-orange-700 text-white'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Book Appointment'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Interactive Book Repair Appointment Form */}
          <div
            id="repair-booking-form"
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 sticky top-20 space-y-5 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-extrabold text-[#ea580c]">
                  Instant Queue Token Generator
                </p>
                <h3 className="font-display text-xl font-extrabold text-slate-900">
                  Book Repair Appointment
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </div>

            {confirmedBooking && (
              <div
                role="status"
                className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Appointment Confirmed
                  </span>
                  <span className="font-mono-num text-sm font-extrabold bg-[#ea580c] text-white px-2.5 py-0.5 rounded">
                    Token: {confirmedBooking.tokenId}
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Device:{' '}
                  <strong className="text-slate-900">
                    {confirmedBooking.brandModel}
                  </strong>{' '}
                  ({confirmedBooking.preferredSlot})
                </p>
                <a
                  href={buildWhatsAppUrl(
                    formatRepairWhatsAppMessage(confirmedBooking)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 min-h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Token {confirmedBooking.tokenId} on WhatsApp</span>
                </a>
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="repair-brand-model"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Mobile Brand &amp; Model *
                </label>
                <input
                  id="repair-brand-model"
                  type="text"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  placeholder="e.g., iPhone 12 / Vivo V27 / Redmi Note 11"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Repair Issue(s) ({selectedIssues.length} selected) *
                </span>
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  {REPAIR_SERVICES_CATALOGUE.map((service) => {
                    const checked = selectedIssues.includes(service.title);
                    return (
                      <label
                        key={service.id}
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          checked
                            ? 'bg-orange-100/80 text-slate-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleIssueSelection(service.title)}
                            className="rounded border-slate-300 text-[#ea580c] focus:ring-[#ea580c]"
                          />
                          <span className="line-clamp-1">{service.title}</span>
                        </div>
                        <span className="font-mono-num text-emerald-700 font-bold shrink-0">
                          ₹{service.startingPrice}+
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="repair-slot"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Preferred Date &amp; Slot
                  </label>
                  <select
                    id="repair-slot"
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:border-[#ea580c] focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="repair-service-type"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Service Type
                  </label>
                  <select
                    id="repair-service-type"
                    value={serviceType}
                    onChange={(e) =>
                      setServiceType(
                        e.target.value as
                          | 'Visit Dhampur Shop'
                          | 'Local Pickup Enquiry'
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:border-[#ea580c] focus:outline-none"
                  >
                    <option value="Visit Dhampur Shop">
                      Visit Dhampur Shop
                    </option>
                    <option value="Local Pickup Enquiry">
                      Local Pickup Enquiry
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="repair-customer-name"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Customer Name *
                  </label>
                  <input
                    id="repair-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="repair-customer-phone"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="repair-customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono-num placeholder:text-slate-400 focus:border-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>

              {bookingError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 min-h-[48px] bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Generate Repair Token &amp; Book Slot</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
