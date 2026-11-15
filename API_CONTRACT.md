# Garasi Hobby — API Contract

**Status:** draft v0.1 · **Owners:** Syamil (frontend) · Ilyas (backend/database)
**Reference:** PRD v1.1 §17, §17.1, §924, `AUTH-03`, `NFR-SEC-03/04`

This document is the agreed boundary between the React frontend and the PHP
backend. The backend owns MySQL, permissions, numbering, and calculations. The
frontend owns presentation. Anything not listed here is a backend detail and
does not need to be shared.

> PRD §17.1: *"Perubahan kontrak API didokumentasikan dan dikoordinasikan antara
> Ilyas dan Syamil."* — change this file first, then the code.

---

## 1. Conventions

| Topic | Rule |
|---|---|
| Format | JSON, `Content-Type: application/json; charset=utf-8` |
| Field names | `snake_case` |
| Money | **integer rupiah**, no decimals, no formatting. `185000` = Rp 185.000 |
| Timestamps | ISO 8601 with offset, e.g. `2026-11-09T09:15:00+07:00` |
| Dates | `YYYY-MM-DD` |
| IDs | opaque strings (`WO-2026-014`, `CUS-001`, `INV-2026-118`) |
| Machine values | lowercase snake_case (`dikerjakan`, `belum_lunas`) |
| Labels | Indonesian labels are a frontend concern; the API never sends display text for enums |
| Pagination | `?page=1&per_page=20` (default 20, max 100) |
| Search | `?q=...`, case-insensitive, backend decides the searched columns |
| Timezone | stored/compared in Asia/Jakarta (WIB); frontend only formats |

### Response envelopes

```json
// list — always includes meta
{ "data": [ ... ], "meta": { "page": 1, "per_page": 20, "total": 6, "total_pages": 1 } }

// single item / mutation
{ "data": { ... } }
```

### Errors

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Data work order belum lengkap.",
    "field_errors": { "customer_name": "Nama pelanggan wajib diisi." }
  }
}
```

| HTTP | `code` | Meaning |
|---|---|---|
| 400 | `validation_failed` | Malformed body |
| 401 | `unauthorized` | No/invalid session |
| 403 | `forbidden` | Authenticated but missing permission |
| 404 | `not_found` | Unknown id or path |
| 409 | `conflict` | Business rule violated (e.g. selling a unit outside a transaction) |
| 422 | `validation_failed` | Field validation — see `field_errors` |
| 500 | `server_error` | Unexpected failure; never leak SQL or stack traces |

Frontend maps `field_errors` keys directly onto form inputs.

---

## 2. Authentication and permissions

Session is a **PHP session cookie** (`HttpOnly`, `SameSite=Lax`). The frontend
sends every request with `credentials: 'include'`. No token is stored in
`localStorage`.

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/session` | — | `{ "data": { "user": User \| null } }` |
| POST | `/session/login` | — | `{ email, password }` → session; `401` on mismatch |
| DELETE | `/session` | — | Logout, returns `{ "data": null }` |

```json
{
  "data": {
    "user": {
      "id": "USR-001",
      "name": "Pak Arif",
      "email": "owner@garasihobby.id",
      "role": "owner",
      "permissions": ["workorder.read", "workorder.create", "..."],
      "is_active": true
    }
  }
}
```

Permissions are checked **on the backend for every request** (`AUTH-03`).
The frontend only uses `permissions` to hide UI it must not show.

| Role | Permissions |
|---|---|
| `owner` | all |
| `mekanik` | `dashboard.read`, `workorder.read`, `workorder.update_status`, `stock.read`, `customer.read` |
| `kasir` | `dashboard.read`, `workorder.read`, `showroom.read`, `stock.read`, `transaction.read`, `transaction.create`, `transaction.pay`, `customer.read`, `customer.manage` |

> **Draft login for the mock:** `owner@garasihobby.id` / `demo123`.

---

## 3. Endpoints

### Work orders — `/work-orders`

| Method | Path | Permission |
|---|---|---|
| GET | `/work-orders?status=&q=&page=&per_page=` | `workorder.read` |
| GET | `/work-orders/{id}` | `workorder.read` |
| POST | `/work-orders` | `workorder.create` |
| PATCH | `/work-orders/{id}/status` | `workorder.update_status` |

```json
// POST payload
{
  "customer_id": "CUS-001",
  "customer_name": "Budi Santoso",
  "phone": "0812-3456-7890",
  "vehicle_name": "Honda Beat",
  "plate_number": "B 1234 XYZ",
  "complaint": "Servis rutin, ganti oli",
  "mechanic_name": "Slamet",
  "estimate_amount": 185000
}

// item
{
  "id": "WO-2026-014",
  "customer": { "id": "CUS-001", "name": "Budi Santoso", "phone": "0812-3456-7890" },
  "vehicle": { "id": "VEH-001", "model_name": "Honda Beat", "plate_number": "B 1234 XYZ" },
  "complaint": "Servis rutin, ganti oli, rem depan terasa blong",
  "mechanic_name": "Slamet",
  "status": "dikerjakan",
  "estimate_total": 185000,
  "created_at": "2026-11-09T09:15:00+07:00",
  "completed_at": null,
  "notes": "Pelanggan menunggu di tempat.",
  "items": [
    { "id": "WOI-014-1", "kind": "jasa", "description": "Jasa servis rutin", "qty": 1, "unit_price": 100000, "subtotal": 100000 }
  ],
  "timeline": [
    { "status": "menunggu", "at": "2026-11-09T09:15:00+07:00", "note": null },
    { "status": "inspeksi", "at": "2026-11-09T09:20:00+07:00", "note": null }
  ]
}
```

`PATCH /work-orders/{id}/status` body: `{ "status": "selesai", "note": "opsional" }`.
The backend appends one `timeline` entry, sets `completed_at` when `selesai`, and
must reject invalid transitions with `422`.

### Showroom units — `/showroom/units`

| Method | Path | Permission |
|---|---|---|
| GET | `/showroom/units?status=&q=` | `showroom.read` |
| GET | `/showroom/units/{id}` | `showroom.read` |
| PATCH | `/showroom/units/{id}` | `showroom.manage` |

`PATCH` body: `{ "status": "reserved" | "tersedia" | "terjual" }`.
**Rule:** changing to `terjual` outside a transaction returns `409 conflict` —
sales must go through `/transactions` so stock and reports stay consistent.

### Transactions — `/transactions`

| Method | Path | Permission |
|---|---|---|
| GET | `/transactions?type=&status=&q=` | `transaction.read` |
| GET | `/transactions/{id}` | `transaction.read` |
| PATCH | `/transactions/{id}/payment` | `transaction.pay` |

`PATCH` body: `{ "status": "lunas" | "belum_lunas" }`. Confirming payment is a
backend decision (`NFR-SEC-11`); the frontend never sends the amount.

### Customers — `/customers`

| Method | Path | Permission |
|---|---|---|
| GET | `/customers?q=&has_vehicle=` | `customer.read` |
| GET | `/customers/{id}` | `customer.read` |

`q` also matches vehicle plate numbers. Detail response adds `history`:

```json
{
  "data": {
    "id": "CUS-003", "name": "Rudi Hartono", "phone": "0813-9988-7766",
    "email": "rudi.hartono@email.com", "address": "Jl. Anggrek No. 44, Bekasi",
    "member_since": "2023-11-11", "tag": "Pelanggan setia",
    "total_spend": 4780000, "last_visit_at": "2026-11-09T08:20:00+07:00",
    "vehicles": [ { "id": "VEH-003", "customer_id": "CUS-003", "model_name": "Honda Vario 125", "plate_number": "F 9021 KL", "year": 2020, "color": "Merah", "last_service_at": "2026-11-09T08:20:00+07:00", "last_service_note": "Ganti kampas rem" } ],
    "history": [ { "id": "HIS-INV-2026-116", "occurred_at": "2026-11-09T08:55:00+07:00", "description": "Jasa setel rem, Kampas rem belakang", "total": 145000, "status": "selesai" } ]
  }
}
```

### Stock — `/stock`

| Method | Path | Permission |
|---|---|---|
| GET | `/stock/parts?status=&category=&q=` | `stock.read` |
| GET | `/stock/movements?page=&per_page=` | `stock.read` |

`status` (`aman` / `menipis` / `habis`) is **derived by the backend** from
`stock_qty` vs `min_qty`; the client never sends it. `average_cost` is
owner-only data and must be omitted for roles without permission.

```json
{ "sku": "OLI-YML-10W", "name": "Oli Mesin Yamalube 10W-40", "category": "Pelumas",
  "stock_qty": 4, "min_qty": 12, "average_cost": 38000, "sale_price": 48000, "status": "menipis" }
```

### Dashboard and reports

| Method | Path | Permission |
|---|---|---|
| GET | `/dashboard/summary` | `dashboard.read` |
| GET | `/reports/summary?from=&to=` | `report.read` |

```json
{ "data": {
  "revenue_today": 28025000, "transaction_count_today": 7, "pending_payment_count": 1,
  "work_orders": { "menunggu": 1, "inspeksi": 1, "dikerjakan": 3, "selesai": 1 },
  "units_available": 3, "low_stock_count": 3,
  "sales_week": [ { "date": "2026-11-09", "amount": 1450000 } ]
} }
```

### Settings — `/settings`

| Method | Path | Permission |
|---|---|---|
| GET | `/settings` | `settings.read` |
| PATCH | `/settings` | `settings.manage` |

`PATCH` accepts partial updates: `business` (object), `payment_methods`
(`[{ "key": "qris", "is_active": true }]`), `preferences`
(`[{ "key": "auto_print_receipt", "is_enabled": false }]`).

---

## 4. Frontend mock mode

The frontend ships a complete fake backend so work can continue without PHP.

```bash
cd frontend
npm run dev            # mock mode is the default
VITE_API_MODE=live npm run dev   # calls the real API instead
```

| File | Role |
|---|---|
| `src/api/types.ts` | the contract, as TypeScript types |
| `src/api/client.ts` | transport (`api.get/post/patch/...`), mode switch, `ApiError` |
| `src/api/mock/data.ts` | seed data matching this contract |
| `src/api/mock/store.ts` | in-memory mutable store |
| `src/api/mock/handlers.ts` | routes, validation, status codes, 250 ms latency |

Switching to the real backend must require **no screen changes** — only
`VITE_API_MODE=live` and a working PHP endpoint set.

Mock-only utility: `POST /mock/reset` restores the seed data.

---

## 5. Open decisions (need Ilyas)

| # | Question | Why it matters |
|---|---|---|
| 1 | PHP session cookie or bearer token? | CORS/`credentials: 'include'` vs header handling |
| 2 | Is `average_cost` ever returned to `kasir`/`mekanik`? | PRD `DSH-08`: sensitive data must not leave the API |
| 3 | Document numbering: backend-generated at insert (recommended) or client-provided? | Duplicate prevention on finalize |
| 4 | Partial payments in MVP, or single payment per transaction? | `INV-2026-116` shows one `belum_lunas` state only |
| 5 | Stock ledger: does `PATCH /transactions/{id}/payment` write movements, or does finalize? | WAC correctness |
| 6 | Soft delete / void for work orders and transactions? | Audit trail requirements |
| 7 | UTC storage with WIB conversion, or WIB storage? | Timestamp consistency across reports |

---

## 6. Change log

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-11-15 | Initial draft from the frontend template + mock backend |
