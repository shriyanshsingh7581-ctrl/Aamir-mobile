export type PhoneNetwork = '5G' | '4G';

export type PhoneConditionBadge = 'Mint Condition' | 'Warranty Available' | 'Superb Condition' | 'Box Open';

export interface SecondHandPhone {
  id: string;
  brand: string;
  model: string;
  network: PhoneNetwork;
  ramStorage: string;
  batteryHealth: number;
  conditionBadge: PhoneConditionBadge;
  price: number;
  mrp: number;
  image: string;
  color: string;
  inStock: boolean;
  verifiedNote: string;
}

export type AccessoryCategory =
  | 'All Accessories'
  | 'TWS Earbuds & Neckbands'
  | 'Fast Chargers & Adapters'
  | 'Data Cables'
  | 'Back Covers & Cases'
  | 'Tempered Glass'
  | 'Power Banks & Speakers';

export interface AccessoryItem {
  id: string;
  name: string;
  category: Exclude<AccessoryCategory, 'All Accessories'>;
  brand: string;
  price: number;
  mrp: number;
  discountLabel: string;
  image: string;
  specs: string;
  inStock: boolean;
}

export interface RepairService {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  startingPrice: number;
  estimatedTime: string;
  warrantyInfo: string;
  highlights: string[];
}

export type RepairStatus = 'Pending' | 'In Repair Lab' | 'Ready for Delivery';

export interface RepairAppointment {
  id: string;
  tokenId: string;
  customerName: string;
  customerPhone: string;
  brandModel: string;
  issues: string[];
  preferredSlot: string;
  serviceType: 'Visit Dhampur Shop' | 'Local Pickup Enquiry';
  status: RepairStatus;
  createdAt: string;
  notes?: string;
}

export type SellMode = 'working' | 'scrap';

export type ScrapFaultCondition =
  | "Dead / Won't Turn On"
  | 'Broken Display + Body'
  | 'Water Damaged Dead'
  | 'Motherboard IC Short / No Network';

export interface SellPhoneLead {
  id: string;
  mode: SellMode;
  brand: string;
  model: string;
  ramStorage?: string;
  conditionOrFault: string;
  boxBillAvailable?: boolean;
  expectedPrice: number;
  customerName: string;
  customerPhone: string;
  photoPreviewUrl?: string;
  createdAt: string;
  status: 'New Lead' | 'Quoted on WhatsApp' | 'Purchased';
}

export interface CartItem {
  id: string;
  itemType: 'phone' | 'accessory';
  name: string;
  subtitle: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMode: 'Store Pickup (Purana Dhampur Chungi)' | 'Dhampur Local Delivery';
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  status: 'Confirmed' | 'Ready for Pickup' | 'Completed';
}
