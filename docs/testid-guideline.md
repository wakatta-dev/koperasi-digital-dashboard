# data-testid Naming Guideline

Gunakan pola berikut agar selector E2E konsisten dan unik:

`<domain>-<screen>-<block>-<element>-<action>`

Contoh:
- `marketplace-checkout-contact-email-input`
- `marketplace-product-detail-add-to-cart-button`
- `marketplace-tracking-submit-button`

## Aturan Wajib

1. Gunakan huruf kecil dan pemisah `-`.
2. Untuk elemen list/row, tambahkan suffix identifier dinamis:
   - `marketplace-cart-item-row-<itemId>`
   - `marketplace-review-star-<orderItemId>-<star>`
3. Satu elemen aksi = satu `data-testid` unik.
4. Hindari selector berbasis teks, class, atau icon untuk E2E.
5. Jika elemen tampil kondisional, `data-testid` tetap harus stabil saat elemen muncul.

## Cakupan Minimal per Halaman

1. Root halaman (`*-page-root`) dan container utama (`*-page-main`).
2. Semua input, textarea, select, checkbox, radio.
3. Semua CTA: button/link submit, retry, next/back, confirm/cancel.
4. Row/item list yang dioperasikan user (dengan suffix ID dinamis).
