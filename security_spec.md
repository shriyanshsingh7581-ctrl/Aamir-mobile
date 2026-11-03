# Security Specification — Aamir Mobile Dhampur (`firebase-integration-rpc`)

## 1. Data Invariants
1. **Global Default Deny**: Any path not explicitly matched in `firestore.rules` is strictly denied (`allow read, write: if false;`).
2. **ID Hardening**: All single-document operations (`get`, `create`, `update`, `delete`) validate document IDs via `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
3. **Email Verification & Identity Integrity**: All authenticated writes require `request.auth != null && request.auth.token.email_verified == true` and `incoming().ownerId == request.auth.uid`.
4. **Bootstrapped Store Admin**: Admin privileges (`isAdmin()`) require `isSignedIn()` and either `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or verified bootstrapped email `request.auth.token.email == 'singhshriyansh51@gmail.com'`.
5. **PII Isolation (`appointments`, `sellLeads`, `orders`)**: Documents containing `customerPhone` and `customerName` are strictly isolated so `get` and `list` only succeed if `isAdmin() || (isSignedIn() && resource.data.ownerId == request.auth.uid)`.
6. **Temporal & Immutable Integrity**: Every `create` operation requires `incoming().createdAt == request.time`. Every `update` operation requires `incoming().createdAt == existing().createdAt`, `incoming().ownerId == existing().ownerId`, and `incoming().updatedAt == request.time`.
7. **Terminal State Locking**: Once an appointment reaches `'Ready for Delivery'`, a sell lead reaches `'Purchased'`, or an order reaches `'Completed'`, non-admin users cannot mutate it further (`existing().status != 'Completed' || isAdmin()`).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Shadow Field Injection)**: Creating a `/phones/ph-99` document with an undeclared field `"isFeaturedHack": true` -> Rejected by `data.keys().hasOnly(...)`.
2. **Payload 2 (Identity Spoofing)**: Creating `/appointments/app-1` where `ownerId` is set to another user's UID -> Rejected by `data.ownerId == request.auth.uid`.
3. **Payload 3 (Unverified Email Admin Spoof)**: Request with `auth.token.email == 'singhshriyansh51@gmail.com'` but `email_verified == false` -> Rejected by `isSignedIn()`.
4. **Payload 4 (PII Leak via Unauthorized Get)**: Authenticated user `user-B` attempting `get(/appointments/app-owned-by-user-A)` -> Rejected by `isAdmin() || (isSignedIn() && existing().ownerId == request.auth.uid)`.
5. **Payload 5 (PII Leak via Blanket List)**: Authenticated user `user-B` running an unfiltered `list` on `/sellLeads` -> Rejected by `allow list: if isAdmin() || (isSignedIn() && existing().ownerId == request.auth.uid)`.
6. **Payload 6 (Client Timestamp Forgery)**: Creating `/orders/ord-1` with a past/future client timestamp instead of `request.time` -> Rejected by `incoming().createdAt == request.time`.
7. **Payload 7 (Immutable Owner Mutation)**: Updating `/orders/ord-1` to change `ownerId` or `createdAt` -> Rejected by `incoming().ownerId == existing().ownerId && incoming().createdAt == existing().createdAt`.
8. **Payload 8 (Value Poisoning on Update)**: Updating `status` on `/appointments/app-1` to `"HACKED_STATUS"` -> Rejected by `isValidRepairAppointment(incoming())` enum check.
9. **Payload 9 (Denial-of-Wallet String Overflow)**: Creating `/sellLeads/lead-1` with a 50,000-character `conditionOrFault` string -> Rejected by `data.conditionOrFault.size() <= 200`.
10. **Payload 10 (ID Poisoning)**: Creating a document with a 300-character or special-character ID -> Rejected by `isValidId(docId)`.
11. **Payload 11 (Terminal State Reversal by Non-Admin)**: Non-admin attempting to update an order after `existing().status == 'Completed'` -> Rejected by terminal state lock.
12. **Payload 12 (Self-Assigned Admin Privilege)**: Non-admin attempting to write `/admins/their-uid` -> Rejected because only bootstrapped admin can create `/admins/{adminId}`.

## 3. Red Team Audit Summary
- **Shadow Update Test**: PASS (`hasAll` + `hasOnly` enforced in every `isValid*` helper and `affectedKeys().hasOnly(...)` in every `allow update`).
- **Email Spoofing Test**: PASS (`request.auth.token.email_verified == true` enforced inside `isSignedIn()`).
- **PII Blanket Test**: PASS (`appointments`, `sellLeads`, and `orders` require `isAdmin()` or `existing().ownerId == request.auth.uid` on both `get` and `list`).
- **Query Trust Test**: PASS (All `allow list` rules inspect `existing()` fields directly without `get()`/`exists()` inside collection scans).
