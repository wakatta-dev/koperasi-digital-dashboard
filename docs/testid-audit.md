# Frontend data-testid Audit

Generated: 2026-02-16T03:01:33.630Z

## Summary

- Files scanned: 368
- Page files: 74
- Files without any data-testid: 342
- Page files without any data-testid: 67
- Files with missing action selectors: 149
- Static data-testid values: 90
- Dynamic data-testid values: 18
- Duplicate data-testid values: 0

## Action Coverage

- Action nodes detected: 866
- Missing action test IDs: 806
- Missing ratio: 93.07%

## Area Breakdown

| Area | Files | Files No Test ID | Files Missing Actions | Missing Actions |
| --- | ---: | ---: | ---: | ---: |
| `src/modules/marketplace` | 99 | 81 | 47 | 240 |
| `src/app` | 86 | 79 | 14 | 179 |
| `src/modules/asset` | 20 | 20 | 15 | 124 |
| `src/modules/asset-reservation` | 49 | 49 | 27 | 97 |
| `src/modules/inventory` | 6 | 6 | 6 | 81 |
| `src/components/shared` | 44 | 44 | 19 | 39 |
| `src/modules/auth` | 9 | 9 | 5 | 18 |
| `src/modules/landing` | 11 | 11 | 5 | 9 |
| `src/components/ui` | 28 | 28 | 5 | 8 |
| `src/modules/dashboard` | 7 | 6 | 4 | 6 |
| `src/modules/finance` | 4 | 4 | 1 | 4 |
| `src/modules/bumdes` | 3 | 3 | 1 | 1 |
| `src/contexts` | 1 | 1 | 0 | 0 |
| `src/lib` | 1 | 1 | 0 | 0 |

## Top Files Missing Action Selectors

| File | Missing Actions | Total Actions |
| --- | ---: | ---: |
| `src/modules/asset/components/features/AssetCreateFormFeature.tsx` | 35 | 35 |
| `src/modules/asset/components/features/AssetEditFormFeature.tsx` | 35 | 35 |
| `src/modules/inventory/components/variant-management.tsx` | 32 | 32 |
| `src/app/(mvp)/bumdes/landing-page/tentang-bumdes/page.tsx` | 27 | 27 |
| `src/app/(mvp)/bumdes/landing-page/produk-unggulan/page.tsx` | 25 | 25 |
| `src/modules/marketplace/components/penjualan/ProductVariantPage.tsx` | 25 | 25 |
| `src/app/(mvp)/bumdes/landing-page/footer-kontak/page.tsx` | 24 | 24 |
| `src/modules/marketplace/components/penjualan/ProductEditPage.tsx` | 20 | 20 |
| `src/app/(mvp)/bumdes/landing-page/keunggulan/page.tsx` | 19 | 19 |
| `src/app/(mvp)/bumdes/landing-page/testimoni/page.tsx` | 19 | 19 |
| `src/modules/inventory/components/edit-product-modal.tsx` | 18 | 18 |
| `src/app/(mvp)/bumdes/landing-page/identitas-navigasi/page.tsx` | 17 | 17 |
| `src/modules/marketplace/order/components/order-retur-dialog.tsx` | 17 | 17 |
| `src/app/(mvp)/bumdes/landing-page/hero-section/page.tsx` | 16 | 16 |
| `src/modules/inventory/components/add-product-modal.tsx` | 15 | 15 |
| `src/modules/marketplace/components/penjualan/ProductCreatePage.tsx` | 13 | 13 |
| `src/modules/asset-reservation/guest/components/status/GuestRequestStatusFeature.tsx` | 11 | 11 |
| `src/modules/inventory/components/inventory-detail-page.tsx` | 10 | 10 |
| `src/modules/marketplace/components/penjualan/CustomerCreateModal.tsx` | 10 | 10 |
| `src/modules/marketplace/components/penjualan/ProductCategoryManagementPage.tsx` | 10 | 10 |
| `src/modules/auth/components/register-form.tsx` | 9 | 9 |
| `src/modules/marketplace/components/penjualan/ProductTable.tsx` | 9 | 9 |
| `src/modules/marketplace/order/components/order-list-page.tsx` | 9 | 9 |
| `src/modules/asset-reservation/detail/components/detail-rental-form.tsx` | 8 | 8 |
| `src/modules/asset-reservation/payment/components/payment-methods.tsx` | 8 | 8 |
| `src/modules/marketplace/order/components/order-detail-page.tsx` | 8 | 8 |
| `src/modules/marketplace/order/components/order-manual-payment-page.tsx` | 8 | 8 |
| `src/modules/asset/components/asset-master-data-page.tsx` | 7 | 7 |
| `src/modules/asset/components/features/AssetListFeature.tsx` | 7 | 7 |
| `src/app/(mvp)/bumdes/landing-page/unit-usaha/page.tsx` | 6 | 6 |

## Top Page Files Missing Action Selectors

| Page | Missing Actions | Total Actions |
| --- | ---: | ---: |
| `src/app/(mvp)/bumdes/landing-page/tentang-bumdes/page.tsx` | 27 | 27 |
| `src/app/(mvp)/bumdes/landing-page/produk-unggulan/page.tsx` | 25 | 25 |
| `src/app/(mvp)/bumdes/landing-page/footer-kontak/page.tsx` | 24 | 24 |
| `src/app/(mvp)/bumdes/landing-page/keunggulan/page.tsx` | 19 | 19 |
| `src/app/(mvp)/bumdes/landing-page/testimoni/page.tsx` | 19 | 19 |
| `src/app/(mvp)/bumdes/landing-page/identitas-navigasi/page.tsx` | 17 | 17 |
| `src/app/(mvp)/bumdes/landing-page/hero-section/page.tsx` | 16 | 16 |
| `src/app/(mvp)/bumdes/landing-page/unit-usaha/page.tsx` | 6 | 6 |
| `src/app/(mvp)/bumdes/report/arus-kas/page.tsx` | 5 | 5 |
| `src/app/(mvp)/bumdes/report/ringkasan/page.tsx` | 5 | 5 |
| `src/app/(mvp)/bumdes/report/laba-rugi/page.tsx` | 4 | 4 |
| `src/app/(mvp)/bumdes/report/neraca/page.tsx` | 4 | 4 |
| `src/app/(mvp)/bumdes/report/penjualan-rinci/page.tsx` | 4 | 4 |
| `src/app/(mvp)/vendor/inventory/page.tsx` | 4 | 4 |

## Page Files Without data-testid

- `src/app/(mvp)/bumdes/accounting/bank-cash/page.tsx`
- `src/app/(mvp)/bumdes/accounting/dashboard/page.tsx`
- `src/app/(mvp)/bumdes/accounting/invoicing-ar/page.tsx`
- `src/app/(mvp)/bumdes/accounting/journal/page.tsx`
- `src/app/(mvp)/bumdes/accounting/reporting/page.tsx`
- `src/app/(mvp)/bumdes/accounting/settings/page.tsx`
- `src/app/(mvp)/bumdes/accounting/tax/page.tsx`
- `src/app/(mvp)/bumdes/accounting/vendor-bills-ap/page.tsx`
- `src/app/(mvp)/bumdes/asset/jadwal/page.tsx`
- `src/app/(mvp)/bumdes/asset/manajemen/[id]/page.tsx`
- `src/app/(mvp)/bumdes/asset/manajemen/edit/page.tsx`
- `src/app/(mvp)/bumdes/asset/manajemen/page.tsx`
- `src/app/(mvp)/bumdes/asset/manajemen/tambah/page.tsx`
- `src/app/(mvp)/bumdes/asset/master-data/page.tsx`
- `src/app/(mvp)/bumdes/asset/page.tsx`
- `src/app/(mvp)/bumdes/asset/pengajuan-sewa/[id]/page.tsx`
- `src/app/(mvp)/bumdes/asset/pengajuan-sewa/page.tsx`
- `src/app/(mvp)/bumdes/asset/pengembalian/[id]/page.tsx`
- `src/app/(mvp)/bumdes/asset/pengembalian/page.tsx`
- `src/app/(mvp)/bumdes/asset/penyewaan/[id]/page.tsx`
- `src/app/(mvp)/bumdes/asset/penyewaan/page.tsx`
- `src/app/(mvp)/bumdes/dashboard/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/footer-kontak/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/hero-section/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/identitas-navigasi/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/keunggulan/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/produk-unggulan/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/tentang-bumdes/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/testimoni/page.tsx`
- `src/app/(mvp)/bumdes/landing-page/unit-usaha/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/inventory/[id]/edit/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/inventory/[id]/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/inventory/[id]/variants/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/inventory/categories/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/inventory/create/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/inventory/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/order/[id]/manual-payment/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/order/[id]/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/order/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/pelanggan/[id]/page.tsx`
- `src/app/(mvp)/bumdes/marketplace/pelanggan/page.tsx`
- `src/app/(mvp)/bumdes/report/arus-kas/page.tsx`
- `src/app/(mvp)/bumdes/report/laba-rugi/page.tsx`
- `src/app/(mvp)/bumdes/report/neraca/page.tsx`
- `src/app/(mvp)/bumdes/report/penjualan-rinci/page.tsx`
- `src/app/(mvp)/bumdes/report/ringkasan/page.tsx`
- `src/app/(mvp)/bumdes/settings/company-profile/page.tsx`
- `src/app/(mvp)/bumdes/settings/general/page.tsx`
- `src/app/(mvp)/bumdes/settings/permissions/page.tsx`
- `src/app/(mvp)/bumdes/settings/users-roles/page.tsx`
- `src/app/(mvp)/bumdes/team/page.tsx`
- `src/app/(mvp)/vendor/account/page.tsx`
- `src/app/(mvp)/vendor/dashboard/page.tsx`
- `src/app/(mvp)/vendor/inventory/[id]/page.tsx`
- `src/app/(mvp)/vendor/inventory/page.tsx`
- `src/app/login/page.tsx`
- `src/app/page.tsx`
- `src/app/penyewaan-aset/[id]/page.tsx`
- `src/app/penyewaan-aset/page.tsx`
- `src/app/penyewaan-aset/payment/page.tsx`
- `src/app/penyewaan-aset/status-reservasi/page.tsx`
- `src/app/penyewaan-aset/status/[id]/page.tsx`
- `src/app/penyewaan-aset/status/page.tsx`
- `src/app/register/page.tsx`
- `src/app/tenant-not-found/page.tsx`

## Duplicate data-testid Values

- No duplicate static `data-testid` values were found.

