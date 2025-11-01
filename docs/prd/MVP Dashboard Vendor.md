# Modul Client Account Management

# 1\. Description

Vendor Dashboard menyediakan modul **Client Account Management** untuk tim Vendor (Admin/Support) mengelola akun klien (tenant). Tiga aksi inti:

1. menambahkan akun email klien (membuat user baru pada tenant),  
2. mengubah email akun klien (primary admin atau user tertentu),  
3. menonaktifkan akun klien (soft deactivate tenant).

# 2\. Objectives & Success Metrics

* **Objektif**

  * Mengurangi waktu penanganan tiket perubahan/penambahan email & suspend tenant.  
  * Menjamin keamanan dan jejak audit untuk setiap aksi sensitif.

* **Success Metrics**

  * Median waktu penyelesaian (request → selesai) turun ≥50%.  
  * Error rate validasi form \<1% (p95/bulan).  
  * 100% aksi tercatat di audit log (who/what/when/why).  
  * 0 insiden kebocoran lintas tenant (cross-tenant data).

# 3\. Features

* **F-1 Add Account Email**: Vendor menambahkan akun email baru pada tenant (role dapat dipilih—default “Client Admin”).  
* **F-2 Edit Client Account Email**: Vendor mengubah alamat email user klien (termasuk primary admin) dengan verifikasi.  
* **F-3 Deactivate Client Account**: Vendor menonaktifkan **tenant** (soft-deactivate: blokir login & API; data tetap).

# 4\. Use Case (singkat)

* **UC-A Add Account Email**

  * Vendor cari tenant → “Add Account Email” → isi email, role, alasan → kirim undangan verifikasi ke email baru → user set password → akun aktif.

* **UC-B Edit Client Account Email**

  * Vendor buka user klien → “Edit Email” → isi email baru \+ alasan → sistem kirim link verifikasi ke email baru → ketika diklik (\<24h), email berubah, sesi lama logout, notifikasi ke email lama & baru.

* **UC-C Deactivate Client Account**

  * Vendor buka tenant → “Deactivate” → pilih reason code \+ 2FA → pre-check job berjalan → suspend login/API dan kirim notifikasi → status tenant “Deactivated”.

# 5\. Dependencies

* **Auth Service & RBAC** (user, role, session, 2FA).  
* **Email Service** (templated email \+ verification link, expiry 24 jam).  
* **Audit Log Service** (WORM/immutable).  
* **Job/Task Orchestrator** (cek/stop job berjalan saat deactivate).  
* **Webhook/Events** (tenant.\* dan user.\* untuk integrasi internal).  
* **Config/Feature Flag** (rollout bertahap; batas rate-limit aksi sensitif).

# 6\. Requirements (Epic, User Story, Accepted Criteria)

## **Epic: Client Account Management (Vendor Dashboard)**

### **US-01 Add Account Email (Create User on Tenant)**

**Sebagai** Vendor Admin/Support, **saya ingin** menambahkan akun email baru pada tenant, **agar** klien memiliki akses tambahan sesuai peran.

**Accepted Criteria**

1. Input: `tenant_id`, `email_baru` (unik sistem), `role` (dropdown: Client Admin/Finance/Viewer—default Client Admin), `reason` (min 10 karakter atau pilih reason code).  
2. Sistem mengirim **invitation/verification link** ke `email_baru` (expired 24 jam).  
3. Status awal user: `PENDING_VERIFICATION`; tidak bisa login sebelum verifikasi.  
4. Saat link diklik \< 24 jam → user set password → status `ACTIVE`; tercatat `created_by_vendor`.  
5. Jika \> 24 jam → token **expired**; Vendor bisa **resend** (maks 3x/24 jam).  
6. Tidak boleh membuat user dengan email yang sudah ada di tenant lain/sistem (409 `email_in_use`).  
7. **Audit log**: actor, tenant\_id, email\_baru, role, reason, request\_id, timestamp, ip/user\_agent.  
8. **Perf**: respon p95 \< 1.5s (proses email async).

### **US-02 Edit Client Account Email (Change Email)**

**Sebagai** Vendor Admin, **saya ingin** mengubah email user klien (termasuk primary admin), **agar** akses tetap valid jika ada koreksi/rotasi.

**Accepted Criteria**

1. Input: `tenant_id`, `user_id`, `email_baru`, `reason` (min 10 char/reason code).  
2. Validasi: format email, **unik secara global** (409 jika sudah dipakai).  
3. Kirim **verify link** ke `email_baru`; status user → `PENDING_EMAIL_CHANGE`.  
4. Saat link diklik (\<24 jam):  
   * `users.email` diganti ke `email_baru`.  
   * **Logout all sessions** user tersebut.  
   * Kirim notifikasi ke email lama & baru (ringkas perubahan \+ waktu).  
5. Jika token kadaluarsa atau invalid → tidak ada perubahan; tampilkan 410/400.  
6. Hanya 1 permintaan perubahan email **aktif** per user (blokir duplikasi).  
7. **Audit log**: actor, user\_id, old\_email, new\_email, reason, applied\_at/request\_id.  
8. **Perf**: respon p95 \< 1.5s (email async).

### **US-03 Deactivate Client Account (Soft Deactivate Tenant)**

**Sebagai** Vendor Admin/Support, **saya ingin** menonaktifkan tenant, **agar** akses dihentikan sementara sesuai kebijakan.

**Accepted Criteria**

1. Aksi membutuhkan **2FA** (Vendor Admin/Support) \+ `reason_code` (Fraud/Non-payment/Offboarding/Legal/Other) \+ optional comment.

2. **Pre-check**: tidak ada **critical running job**; jika ada → tampilkan daftar & opsi “Cancel/Wait” (force stop hanya Vendor Admin).

3. Efek:

   * Semua login user tenant dan **API keys**: `SUSPENDED` segera.  
   * Job baru/scheduler: diblok.  
   * Emit event `tenant.deactivated{tenant_id, reason_code, actor_id, ts}`.  
4. Email notifikasi terkirim ke Primary Admin & kontak billing tenant.  
5. Status tenant berubah ke `DEACTIVATED` dan terlihat di list & detail.  
6. **Audit log** lengkap (from→to status, reason, actor, ts, ip/UA).  
7. **Perf**: respon p95 \< 1s; block job maksimal **T+30s** (eventual).

---

### **Non-Functional & Guardrails (lintas US)**

* **Security**: RBAC (Vendor Admin full; Vendor Support terbatas); rate-limit aksi sensitif 5 req/menit/actor; semua write butuh `X-Idempotency-Key`.  
* **Privacy/Logging**: audit immutable; masking email pada log aplikasi (sliced).  
* **Reliability**: Email/verifikasi ter-retry (exponential backoff); events idempotent.  
* **Observability**: metrics—request count, success rate, verify conversion, TTV (time-to-verify), deactivate count; alert 5xx \>1%/5m, verify fail \>5%/h.