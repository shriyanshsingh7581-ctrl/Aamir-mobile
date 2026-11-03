import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  AccessoryItem,
  CustomerOrder,
  RepairAppointment,
  SecondHandPhone,
  SellPhoneLead,
} from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return cleaned || `id-${Date.now()}`;
}

function clampString(val: string, minLen: number, maxLen: number, fallback = 'N/A'): string {
  const trimmed = (val || '').trim();
  const base = trimmed.length >= minLen ? trimmed : fallback;
  return base.slice(0, maxLen);
}

export async function signInWithGooglePopup(): Promise<User | null> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

export function subscribePublicCatalogue(
  onPhonesUpdate: (phones: SecondHandPhone[]) => void,
  onAccessoriesUpdate: (accessories: AccessoryItem[]) => void,
  onSyncStatus?: (connected: boolean) => void
): () => void {
  const phonesPath = 'phones';
  const accessoriesPath = 'accessories';

  const unsubPhones = onSnapshot(
    query(collection(db, phonesPath), where('inStock', '==', true)),
    (snapshot) => {
      onSyncStatus?.(true);
      if (!snapshot.empty) {
        const items: SecondHandPhone[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            brand: data.brand || 'Brand',
            model: data.model || 'Model',
            network: data.network === '4G' ? '4G' : '5G',
            ramStorage: data.ramStorage || '8GB / 128GB',
            batteryHealth: Number(data.batteryHealth) || 95,
            conditionBadge: data.conditionBadge || 'Mint Condition',
            price: Number(data.price) || 0,
            mrp: Number(data.mrp) || 0,
            image: data.image || '/assets/aistudio/IMG-20261103-WA0075_142004cc.jpg',
            color: data.color || 'Standard',
            inStock: Boolean(data.inStock),
            verifiedNote: data.verifiedNote || 'Verified at Aamir Mobile Dhampur',
          };
        });
        onPhonesUpdate(items);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, phonesPath);
      } catch {
        onSyncStatus?.(false);
      }
    }
  );

  const unsubAcc = onSnapshot(
    query(collection(db, accessoriesPath), where('inStock', '==', true)),
    (snapshot) => {
      onSyncStatus?.(true);
      if (!snapshot.empty) {
        const items: AccessoryItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            name: data.name || 'Accessory',
            category: data.category || 'TWS Earbuds & Neckbands',
            brand: data.brand || 'Aamir Mobile Original',
            price: Number(data.price) || 0,
            mrp: Number(data.mrp) || 0,
            discountLabel: data.discountLabel || '50% OFF',
            image: data.image || '/assets/aistudio/IMG-20261103-WA0074_db4f0c7f.jpg',
            specs: data.specs || 'Original Quality with Store Warranty',
            inStock: Boolean(data.inStock),
          };
        });
        onAccessoriesUpdate(items);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, accessoriesPath);
      } catch {
        onSyncStatus?.(false);
      }
    }
  );

  return () => {
    unsubPhones();
    unsubAcc();
  };
}

export function subscribeAuthenticatedCollections(
  user: User,
  isAdminUser: boolean,
  onAppointmentsUpdate: (items: RepairAppointment[]) => void,
  onSellLeadsUpdate: (items: SellPhoneLead[]) => void,
  onOrdersUpdate: (items: CustomerOrder[]) => void
): () => void {
  const appointmentsRef = isAdminUser
    ? collection(db, 'appointments')
    : query(collection(db, 'appointments'), where('ownerId', '==', user.uid));

  const sellLeadsRef = isAdminUser
    ? collection(db, 'sellLeads')
    : query(collection(db, 'sellLeads'), where('ownerId', '==', user.uid));

  const ordersRef = isAdminUser
    ? collection(db, 'orders')
    : query(collection(db, 'orders'), where('ownerId', '==', user.uid));

  const unsubApp = onSnapshot(
    appointmentsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: RepairAppointment[] = snapshot.docs.map((d) => {
          const data = d.data();
          const issuesStr = typeof data.issues === 'string' ? data.issues : '';
          return {
            id: data.id || d.id,
            tokenId: data.tokenId || 'AM-REP-101',
            customerName: data.customerName || 'Customer',
            customerPhone: data.customerPhone || '9897060816',
            brandModel: data.brandModel || 'Smartphone',
            issues: issuesStr ? issuesStr.split(' | ') : ['General Repair'],
            preferredSlot: data.preferredSlot || 'Today Morning',
            serviceType:
              data.serviceType === 'Local Pickup Enquiry'
                ? 'Local Pickup Enquiry'
                : 'Visit Dhampur Shop',
            status: data.status || 'Pending',
            createdAt: 'Synced via Firebase Live',
          };
        });
        onAppointmentsUpdate(list);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
      } catch {
        // Handled and logged via handleFirestoreError
      }
    }
  );

  const unsubLeads = onSnapshot(
    sellLeadsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: SellPhoneLead[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            mode: data.mode === 'working' ? 'working' : 'scrap',
            brand: data.brand || 'Smartphone',
            model: data.model || 'Model',
            conditionOrFault: data.conditionOrFault || 'Inspection Requested',
            expectedPrice: Number(data.expectedPrice) || 1000,
            customerName: data.customerName || 'Customer',
            customerPhone: data.customerPhone || '9897060816',
            createdAt: 'Synced via Firebase Live',
            status: data.status || 'New Lead',
          };
        });
        onSellLeadsUpdate(list);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'sellLeads');
      } catch {
        // Handled and logged via handleFirestoreError
      }
    }
  );

  const unsubOrders = onSnapshot(
    ordersRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: CustomerOrder[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            orderNumber: data.orderNumber || 'AM-ORD-501',
            customerName: data.customerName || 'Customer',
            customerPhone: data.customerPhone || '9897060816',
            deliveryMode:
              data.deliveryMode === 'Dhampur Local Delivery'
                ? 'Dhampur Local Delivery'
                : 'Store Pickup (Purana Dhampur Chungi)',
            items: [
              {
                id: `${d.id}-item`,
                itemType: 'accessory',
                name: data.itemsSummary || 'Aamir Mobile Order',
                subtitle: 'Firebase Synced Order',
                price: Number(data.totalAmount) || 0,
                mrp: Number(data.totalAmount) || 0,
                quantity: 1,
                image: '/assets/aistudio/IMG-20261103-WA0075_142004cc.jpg',
              },
            ],
            totalAmount: Number(data.totalAmount) || 0,
            createdAt: 'Synced via Firebase Live',
            status: data.status || 'Confirmed',
          };
        });
        onOrdersUpdate(list);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      } catch {
        // Handled and logged via handleFirestoreError
      }
    }
  );

  return () => {
    unsubApp();
    unsubLeads();
    unsubOrders();
  };
}

export async function savePhoneToFirestore(phone: SecondHandPhone): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(phone.id);
  const path = `phones/${docId}`;
  try {
    await setDoc(doc(db, 'phones', docId), {
      id: docId,
      brand: clampString(phone.brand, 1, 60, 'Brand'),
      model: clampString(phone.model, 1, 120, 'Model'),
      network: phone.network === '4G' ? '4G' : '5G',
      ramStorage: clampString(phone.ramStorage, 1, 60, '8GB / 128GB'),
      batteryHealth: Math.min(100, Math.max(1, Math.round(phone.batteryHealth || 95))),
      conditionBadge: phone.conditionBadge || 'Mint Condition',
      price: Math.min(500000, Math.max(0, Number(phone.price) || 0)),
      mrp: Math.min(600000, Math.max(0, Number(phone.mrp) || 0)),
      image: clampString(phone.image, 1, 500, '/assets/aistudio/IMG-20261103-WA0075_142004cc.jpg'),
      color: clampString(phone.color, 1, 80, 'Standard'),
      inStock: Boolean(phone.inStock),
      verifiedNote: clampString(phone.verifiedNote, 1, 240, 'Verified by Aamir Mobile'),
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deletePhoneFromFirestore(phoneId: string): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(phoneId);
  const path = `phones/${docId}`;
  try {
    await deleteDoc(doc(db, 'phones', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveAccessoryToFirestore(acc: AccessoryItem): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(acc.id);
  const path = `accessories/${docId}`;
  try {
    await setDoc(doc(db, 'accessories', docId), {
      id: docId,
      name: clampString(acc.name, 1, 140, 'Accessory'),
      category: acc.category,
      brand: clampString(acc.brand, 1, 100, 'Aamir Mobile'),
      price: Math.min(200000, Math.max(0, Number(acc.price) || 0)),
      mrp: Math.min(250000, Math.max(0, Number(acc.mrp) || 0)),
      discountLabel: clampString(acc.discountLabel, 1, 40, '50% OFF'),
      image: clampString(acc.image, 1, 500, '/assets/aistudio/IMG-20261103-WA0074_db4f0c7f.jpg'),
      specs: clampString(acc.specs, 1, 240, 'Original Quality'),
      inStock: Boolean(acc.inStock),
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteAccessoryFromFirestore(accId: string): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(accId);
  const path = `accessories/${docId}`;
  try {
    await deleteDoc(doc(db, 'accessories', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveAppointmentToFirestore(
  booking: RepairAppointment
): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(booking.id);
  const path = `appointments/${docId}`;
  try {
    await setDoc(doc(db, 'appointments', docId), {
      id: docId,
      tokenId: clampString(booking.tokenId, 1, 40, 'AM-REP-101'),
      customerName: clampString(booking.customerName, 1, 100, 'Customer'),
      customerPhone: clampString(booking.customerPhone, 10, 20, '9897060816'),
      brandModel: clampString(booking.brandModel, 1, 120, 'Smartphone'),
      issues: clampString(booking.issues.join(' | '), 1, 400, 'General Repair'),
      preferredSlot: clampString(booking.preferredSlot, 1, 100, 'Today Morning'),
      serviceType: booking.serviceType,
      status: booking.status,
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateAppointmentStatusInFirestore(
  appointmentId: string,
  status: RepairAppointment['status']
): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(appointmentId);
  const path = `appointments/${docId}`;
  try {
    await updateDoc(doc(db, 'appointments', docId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveSellLeadToFirestore(lead: SellPhoneLead): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(lead.id);
  const path = `sellLeads/${docId}`;
  try {
    await setDoc(doc(db, 'sellLeads', docId), {
      id: docId,
      mode: lead.mode,
      brand: clampString(lead.brand, 1, 60, 'Smartphone'),
      model: clampString(lead.model, 1, 120, 'Model'),
      conditionOrFault: clampString(lead.conditionOrFault, 1, 200, 'Inspection'),
      expectedPrice: Math.min(500000, Math.max(1, Number(lead.expectedPrice) || 1000)),
      customerName: clampString(lead.customerName, 1, 100, 'Customer'),
      customerPhone: clampString(lead.customerPhone, 10, 20, '9897060816'),
      status: lead.status,
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSellLeadStatusInFirestore(
  leadId: string,
  status: SellPhoneLead['status']
): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(leadId);
  const path = `sellLeads/${docId}`;
  try {
    await updateDoc(doc(db, 'sellLeads', docId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveOrderToFirestore(order: CustomerOrder): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(order.id);
  const path = `orders/${docId}`;
  const summaryText = order.items
    .map((i) => `${i.name} x${i.quantity}`)
    .join(', ');
  try {
    await setDoc(doc(db, 'orders', docId), {
      id: docId,
      orderNumber: clampString(order.orderNumber, 1, 40, 'AM-ORD-501'),
      customerName: clampString(order.customerName, 1, 100, 'Customer'),
      customerPhone: clampString(order.customerPhone, 10, 20, '9897060816'),
      deliveryMode: order.deliveryMode,
      itemsSummary: clampString(summaryText, 1, 500, 'Store Order'),
      totalAmount: Math.min(1000000, Math.max(0, Number(order.totalAmount) || 0)),
      status: order.status,
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: CustomerOrder['status']
): Promise<void> {
  if (!auth.currentUser) return;
  const docId = sanitizeId(orderId);
  const path = `orders/${docId}`;
  try {
    await updateDoc(doc(db, 'orders', docId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function seedCatalogueToFirestore(
  phones: SecondHandPhone[],
  accessories: AccessoryItem[]
): Promise<void> {
  if (!auth.currentUser) return;
  for (const phone of phones) {
    await savePhoneToFirestore(phone);
  }
  for (const acc of accessories) {
    await saveAccessoryToFirestore(acc);
  }
}
