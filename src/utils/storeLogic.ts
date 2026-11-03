import {
  AccessoryCategory,
  AccessoryItem,
  CartItem,
  RepairAppointment,
  RepairStatus,
  SecondHandPhone,
  SellPhoneLead,
} from '../types';

export const ADMIN_PIN = '7777';
export const PRIMARY_WHATSAPP = '919897060816';
export const PRIMARY_PHONE_DISPLAY = '+91 9897060816';
export const SECONDARY_PHONE_DISPLAY = '+91 9306181811';
export const SHOP_ADDRESS =
  'Purana Dhampur Chungi, Kalagarh Road, Dhampur (Bijnor) U.P. 246761';

export function verifyAdminPin(inputPin: string): boolean {
  return inputPin.trim() === ADMIN_PIN;
}

export function generateRepairTokenId(existingCount: number): string {
  const nextNumber = 101 + Math.max(0, existingCount);
  return `AM-REP-${nextNumber}`;
}

export function generateOrderNumber(existingCount: number): string {
  const nextNumber = 501 + Math.max(0, existingCount);
  return `AM-ORD-${nextNumber}`;
}

export function calculateDiscountPercentage(price: number, mrp: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function filterPhones(
  phones: SecondHandPhone[],
  searchQuery: string,
  brandFilter: string,
  networkFilter: 'ALL' | '5G' | '4G'
): SecondHandPhone[] {
  const q = searchQuery.trim().toLowerCase();
  return phones.filter((phone) => {
    const matchesSearch =
      !q ||
      phone.brand.toLowerCase().includes(q) ||
      phone.model.toLowerCase().includes(q) ||
      phone.ramStorage.toLowerCase().includes(q);
    const matchesBrand =
      brandFilter === 'All Brands' ||
      phone.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchesNetwork =
      networkFilter === 'ALL' || phone.network === networkFilter;
    return matchesSearch && matchesBrand && matchesNetwork;
  });
}

export function filterAccessories(
  accessories: AccessoryItem[],
  category: AccessoryCategory,
  searchQuery: string
): AccessoryItem[] {
  const q = searchQuery.trim().toLowerCase();
  return accessories.filter((item) => {
    const matchesCategory =
      category === 'All Accessories' || item.category === category;
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.specs.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

export function calculateCartSummary(items: CartItem[]): {
  totalItems: number;
  subtotal: number;
  totalMrp: number;
  totalSavings: number;
} {
  let totalItems = 0;
  let subtotal = 0;
  let totalMrp = 0;

  for (const item of items) {
    const qty = Math.max(0, item.quantity);
    totalItems += qty;
    subtotal += item.price * qty;
    totalMrp += Math.max(item.mrp, item.price) * qty;
  }

  return {
    totalItems,
    subtotal,
    totalMrp,
    totalSavings: Math.max(0, totalMrp - subtotal),
  };
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePhoneInput(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

export function validateRepairBookingInput(input: {
  brandModel: string;
  issues: string[];
  preferredSlot: string;
  customerName: string;
  customerPhone: string;
}): ValidationResult {
  if (!input.brandModel.trim()) {
    return { valid: false, error: 'Please enter your mobile brand & model.' };
  }
  if (!input.issues || input.issues.length === 0) {
    return { valid: false, error: 'Please select at least one repair issue.' };
  }
  if (!input.preferredSlot.trim()) {
    return { valid: false, error: 'Please choose a preferred date & time slot.' };
  }
  if (!input.customerName.trim()) {
    return { valid: false, error: 'Please enter your name.' };
  }
  if (!validatePhoneInput(input.customerPhone)) {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit mobile number.',
    };
  }
  return { valid: true };
}

export function validateSellPhoneLeadInput(input: {
  mode: 'working' | 'scrap';
  brand: string;
  model: string;
  conditionOrFault: string;
  expectedPrice: number;
  customerName: string;
  customerPhone: string;
}): ValidationResult {
  if (!input.brand.trim() || !input.model.trim()) {
    return { valid: false, error: 'Please specify both phone brand and model.' };
  }
  if (!input.conditionOrFault.trim()) {
    return {
      valid: false,
      error:
        input.mode === 'scrap'
          ? 'Please select the fault condition of the dead/scrap phone.'
          : 'Please select the physical condition of your phone.',
    };
  }
  if (!Number.isFinite(input.expectedPrice) || input.expectedPrice <= 0) {
    return {
      valid: false,
      error: 'Please enter a valid expected cash value in ₹.',
    };
  }
  if (!input.customerName.trim()) {
    return { valid: false, error: 'Please enter your full name.' };
  }
  if (!validatePhoneInput(input.customerPhone)) {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit WhatsApp/mobile number.',
    };
  }
  return { valid: true };
}

export function cycleRepairStatus(current: RepairStatus): RepairStatus {
  if (current === 'Pending') return 'In Repair Lab';
  if (current === 'In Repair Lab') return 'Ready for Delivery';
  return 'Pending';
}

export function buildWhatsAppUrl(message: string, phone = PRIMARY_WHATSAPP): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function formatSellLeadWhatsAppMessage(lead: SellPhoneLead): string {
  const header =
    lead.mode === 'scrap'
      ? '🔧 *SELL SCRAP / DEAD PHONE REQUEST — AAMIR MOBILE DHAMPUR*'
      : '📱 *SELL WORKING 2ND-HAND PHONE REQUEST — AAMIR MOBILE DHAMPUR*';

  return [
    header,
    `• *Brand & Model:* ${lead.brand} ${lead.model}`,
    lead.ramStorage ? `• *RAM/Storage:* ${lead.ramStorage}` : null,
    `• *Condition / Fault:* ${lead.conditionOrFault}`,
    lead.mode === 'working'
      ? `• *Box/Bill:* ${lead.boxBillAvailable ? 'Yes, Available' : 'Phone Only'}`
      : null,
    `• *Expected Cash Value:* ₹${lead.expectedPrice.toLocaleString('en-IN')}`,
    `• *Customer:* ${lead.customerName} (${lead.customerPhone})`,
    `Please share your best instant cash quote at Purana Dhampur Chungi shop.`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatRepairWhatsAppMessage(booking: RepairAppointment): string {
  return [
    `🔬 *IC-LEVEL REPAIR BOOKING — AAMIR MOBILE DHAMPUR*`,
    `• *Token ID:* ${booking.tokenId}`,
    `• *Device:* ${booking.brandModel}`,
    `• *Repair Issue(s):* ${booking.issues.join(', ')}`,
    `• *Preferred Slot:* ${booking.preferredSlot}`,
    `• *Service Mode:* ${booking.serviceType}`,
    `• *Customer:* ${booking.customerName} (${booking.customerPhone})`,
  ].join('\n');
}
