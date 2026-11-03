import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminPin,
  generateRepairTokenId,
  calculateDiscountPercentage,
  filterPhones,
  filterAccessories,
  calculateCartSummary,
  validateRepairBookingInput,
  validateSellPhoneLeadInput,
  cycleRepairStatus,
  formatSellLeadWhatsAppMessage,
} from './storeLogic';
import { SecondHandPhone, AccessoryItem } from '../types';

const samplePhones: SecondHandPhone[] = [
  {
    id: 'p1',
    brand: 'Apple',
    model: 'iPhone 13',
    network: '5G',
    ramStorage: '128GB',
    batteryHealth: 89,
    conditionBadge: 'Mint Condition',
    price: 34500,
    mrp: 49900,
    image: '/assets/aistudio/IMG-20261103-WA0075_142004cc.jpg',
    color: 'Midnight',
    inStock: true,
    verifiedNote: '100% Original Display & Face ID Working',
  },
  {
    id: 'p2',
    brand: 'Apple',
    model: 'iPhone 11',
    network: '4G',
    ramStorage: '64GB',
    batteryHealth: 86,
    conditionBadge: 'Warranty Available',
    price: 18500,
    mrp: 29900,
    image: '/assets/aistudio/IMG-20261103-WA0075_142004cc.jpg',
    color: 'Purple',
    inStock: true,
    verifiedNote: '1 Month Shop Testing Warranty',
  },
];

const sampleAccessories: AccessoryItem[] = [
  {
    id: 'a1',
    name: 'SuperVOOC 65W Fast Charger',
    category: 'Fast Chargers & Adapters',
    brand: 'Oppo / Realme Compatible',
    price: 699,
    mrp: 1499,
    discountLabel: '53% OFF',
    image: '/assets/aistudio/IMG-20261103-WA0074_db4f0c7f.jpg',
    specs: '65W Type-C Warp/SuperVOOC',
    inStock: true,
  },
  {
    id: 'a2',
    name: 'Pro Bass Wireless Neckband',
    category: 'TWS Earbuds & Neckbands',
    brand: 'AM Original Series',
    price: 399,
    mrp: 999,
    discountLabel: '60% OFF',
    image: '/assets/aistudio/IMG-20261103-WA0074_db4f0c7f.jpg',
    specs: '40H Playtime, Magnetic Earbuds',
    inStock: true,
  },
];

test('verifyAdminPin validates PIN 7777 accurately', () => {
  assert.equal(verifyAdminPin('7777'), true);
  assert.equal(verifyAdminPin(' 7777 '), true);
  assert.equal(verifyAdminPin('1234'), false);
});

test('generateRepairTokenId creates sequential AM-REP tokens', () => {
  assert.equal(generateRepairTokenId(3), 'AM-REP-104');
  assert.equal(generateRepairTokenId(0), 'AM-REP-101');
});

test('calculateDiscountPercentage computes accurate integer discount', () => {
  assert.equal(calculateDiscountPercentage(699, 1499), 53);
  assert.equal(calculateDiscountPercentage(1500, 1500), 0);
});

test('filterPhones filters by brand, network, and query', () => {
  assert.equal(filterPhones(samplePhones, '', 'All Brands', 'ALL').length, 2);
  assert.equal(filterPhones(samplePhones, '', 'All Brands', '5G').length, 1);
  assert.equal(filterPhones(samplePhones, 'iphone 11', 'Apple', 'ALL').length, 1);
});

test('filterAccessories filters by category and search keyword', () => {
  assert.equal(
    filterAccessories(sampleAccessories, 'All Accessories', '').length,
    2
  );
  assert.equal(
    filterAccessories(sampleAccessories, 'Fast Chargers & Adapters', '').length,
    1
  );
  assert.equal(
    filterAccessories(sampleAccessories, 'All Accessories', 'neckband').length,
    1
  );
});

test('calculateCartSummary totals items, subtotal, and savings', () => {
  const summary = calculateCartSummary([
    {
      id: 'a1',
      itemType: 'accessory',
      name: 'Charger',
      subtitle: '65W',
      price: 700,
      mrp: 1500,
      quantity: 2,
      image: '',
    },
  ]);
  assert.equal(summary.totalItems, 2);
  assert.equal(summary.subtotal, 1400);
  assert.equal(summary.totalMrp, 3000);
  assert.equal(summary.totalSavings, 1600);
});

test('validateRepairBookingInput enforces required fields and 10-digit phone', () => {
  const invalid = validateRepairBookingInput({
    brandModel: 'Vivo V27',
    issues: [],
    preferredSlot: 'Today Morning',
    customerName: 'Aman',
    customerPhone: '9897060816',
  });
  assert.equal(invalid.valid, false);

  const valid = validateRepairBookingInput({
    brandModel: 'Vivo V27',
    issues: ['Display / Folder / Combo Replacement'],
    preferredSlot: 'Today Morning (10 AM - 1 PM)',
    customerName: 'Aman',
    customerPhone: '9897060816',
  });
  assert.equal(valid.valid, true);
});

test('validateSellPhoneLeadInput validates both working and scrap phone leads', () => {
  const scrapLeadCheck = validateSellPhoneLeadInput({
    mode: 'scrap',
    brand: 'Samsung',
    model: 'A52',
    conditionOrFault: "Dead / Won't Turn On",
    expectedPrice: 1800,
    customerName: 'Rohan',
    customerPhone: '9876543210',
  });
  assert.equal(scrapLeadCheck.valid, true);

  const missingPhone = validateSellPhoneLeadInput({
    mode: 'scrap',
    brand: 'Samsung',
    model: 'A52',
    conditionOrFault: "Dead / Won't Turn On",
    expectedPrice: 1800,
    customerName: 'Rohan',
    customerPhone: '123',
  });
  assert.equal(missingPhone.valid, false);
});

test('cycleRepairStatus transitions Pending -> In Repair Lab -> Ready for Delivery', () => {
  assert.equal(cycleRepairStatus('Pending'), 'In Repair Lab');
  assert.equal(cycleRepairStatus('In Repair Lab'), 'Ready for Delivery');
  assert.equal(cycleRepairStatus('Ready for Delivery'), 'Pending');
});

test('formatSellLeadWhatsAppMessage includes scrap header and price', () => {
  const msg = formatSellLeadWhatsAppMessage({
    id: 's1',
    mode: 'scrap',
    brand: 'Redmi',
    model: 'Note 10 Pro',
    conditionOrFault: 'Dead / Won\'t Turn On',
    expectedPrice: 1500,
    customerName: 'Zaid',
    customerPhone: '9897001122',
    createdAt: 'Just now',
    status: 'New Lead',
  });
  assert.ok(msg.includes('SELL SCRAP / DEAD PHONE REQUEST'));
  assert.ok(msg.includes('1,500'));
});
