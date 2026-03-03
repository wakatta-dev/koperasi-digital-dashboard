# Design System: Koperasi Digital Frontend
**Project ID:** local-frontend-synthesis (derived from `frontend/*` and local Stitch HTML exports in `design/*`)

## 1. Visual Theme & Atmosphere

Koperasi Digital Frontend mengusung nuansa **enterprise yang terpercaya, rapi, dan berorientasi utilitas** dengan aksen komunitas lokal. Karakter visualnya memadukan dashboard operasional yang padat data dengan landing/marketplace yang lebih hangat dan komunikatif.

Mood utama dapat dirangkum sebagai:
- **Structured and calm**: tata letak grid yang konsisten, hierarki jelas, dan ruang antarblok yang terukur.
- **Trust-first**: dominasi indigo sebagai aksen utama memberi kesan stabil, aman, dan institusional.
- **Practical modernism**: elemen UI tidak dekoratif berlebihan; fokus pada keterbacaan, status, dan aksi cepat.
- **Dual-context ready**: tetap kohesif untuk mode light/dark dan untuk konteks publik (marketplace) maupun internal (dashboard).

## 2. Color Palette & Roles

### Core Brand & Accent
- **Indigo Komando** (`#4338CA`) - Aksen primer untuk CTA, highlight aktif, focus visual, dan identitas merek.
- **Indigo Dalam** (`#312E81`) - Lapisan sekunder untuk area bernuansa kuat seperti footer/hero gelap.
- **Indigo Hover Tegas** (`#3730A3`) - State hover untuk menjaga kontras aksi primer.
- **Indigo Guest Flow** (`#4F46E5`) - Override aksen pada alur guest tertentu (asset-rental) tanpa keluar dari keluarga warna utama.

### Surface & Background
- **Putih Permukaan** (`#FFFFFF`) - Latar kartu dan panel utama di mode terang.
- **Kabut Netral** (`#F8FAFC`) - Surface halus untuk background sekunder dan blok pemisah.
- **Malam Dasar** (`#0F172A`) - Background utama mode gelap.
- **Slate Kartu Gelap** (`#1E293B`) - Surface card/container di mode gelap.

### Text & Hierarchy
- **Tinta Utama** (`#0F172A`) - Teks heading dan konten utama pada mode terang.
- **Abu Naratif** (`#334155`) - Teks sekunder, deskripsi, dan metadata.
- **Tinta Invers** (`#F8FAFC`) - Teks utama pada latar gelap.
- **Abu Invers** (`#CBD5E1`) - Teks sekunder pada mode gelap.

### Supporting Status Tones
- **Info Biru Lembut** (`#3B82F6`) - Status informasional atau progres.
- **Sukses Hijau** (`#10B981`) - Status berhasil/selesai.
- **Peringatan Amber** (`#FBBF24`) - Status menunggu/peringatan ringan.
- **Bahaya Merah** (`#EF4444`) - Error, overdue, atau kondisi kritis.

## 3. Typography Rules

### Font Families
- **Display/Public-first**: Plus Jakarta Sans untuk marketplace dan landing experience.
- **App shell/system**: Geist/Inter untuk dashboard operasional dan komponen utilitarian.
- **Iconography**: Material Symbols Outlined + Lucide untuk ikon fungsional.

### Weight & Hierarchy
- **Hero/Headline besar**: 700-800, tracking rapat, kontras tinggi.
- **Section title**: 600-700, dipakai konsisten untuk pemisah konteks.
- **Body utama**: 400-500 dengan line-height lega untuk keterbacaan data dan narasi.
- **Label kecil dan badge**: 500-700, sering uppercase dengan tracking melebar untuk status/kategori.

### Typographic Character
- Dominan sans-serif modern dengan bentuk bersih.
- Kontras hierarki lebih mengandalkan bobot, ukuran, dan warna daripada dekorasi.
- Bahasa visual cocok untuk konten bilingual ringan, namun saat ini tone copy utama berbahasa Indonesia.

## 4. Component Stylings

### Buttons
- **Primary**: aksen indigo (`#4338CA`) dengan teks putih; dipakai untuk aksi utama.
- **Shape**: kombinasi rounded-lg/rounded-xl untuk konteks dashboard, dan pill (`rounded-full`) untuk CTA publik.
- **Hover**: bergeser ke indigo lebih dalam (`#3730A3`) dengan transisi halus.
- **Emphasis**: sering memakai soft shadow berwarna indigo untuk memperjelas affordance.

### Cards & Containers
- **Base card**: permukaan terang/gelap dengan border tipis netral dan radius lembut.
- **Corner language**: mayoritas `rounded-xl`, dengan variasi `rounded-2xl` pada blok hero/feature.
- **Depth**: bayangan ringan (`elev-1`) untuk default, naik ke `elev-2` saat butuh penekanan.
- **Dark mode parity**: kartu tetap mempertahankan struktur border dan kontras konten.

### Inputs & Forms
- **Input shell**: border halus, latar bersih, radius medium.
- **Focus behavior**: ring/focus diarahkan ke aksen primer untuk sinyal interaksi yang konsisten.
- **Form containers**: memakai pola `surface-form` / `surface-form-lg` untuk ruang input yang terstruktur.
- **Validation readability**: helper text dan error state dipisah jelas lewat ukuran teks kecil dan warna semantik.

### Data Display & Navigation
- **Tables/KPI**: shell konsisten dengan border + card surface, menekankan keterbacaan dan scan cepat.
- **Sidebar/nav**: active state bernuansa indigo dengan ring/background lembut.
- **Badges/status chips**: mengandalkan tint warna fungsional (blue/green/amber/red) untuk makna cepat.

## 5. Layout Principles

### Spacing System
- Menggunakan ritme spasial berbasis token:
  - `layout-space-card`: `1.5rem`
  - `layout-space-card-lg`: `2rem`
  - `layout-space-section`: `2.5rem`
  - `layout-space-gap`: `1rem`
- Strategi ini menjaga konsistensi antarhalaman data-dense dan halaman pemasaran.

### Grid & Structure
- Landing/public sections cenderung memakai kontainer `max-w-7xl` dengan grid responsif bertahap.
- Dashboard dan halaman operasional mengutamakan layout modular: section shell -> surface card -> komponen data.
- Pola ini memudahkan skalabilitas fitur lintas modul (marketplace, asset, accounting, settings).

### Geometry & Shape Translation
- `rounded-full` -> **pill-shaped** untuk CTA dan elemen aksen.
- `rounded-lg` -> **subtly rounded corners** untuk input, chip, dan komponen kecil.
- `rounded-xl/2xl` -> **gently rounded containers** untuk card dan panel konten utama.

### Depth & Elevation
- **Default**: bayangan tipis difus untuk membedakan surface tanpa efek berlebihan.
- **Priority surfaces**: shadow lebih dalam untuk modal, preview frame, atau card yang perlu fokus.
- **Dark mode**: bayangan digelapkan untuk menjaga pemisahan lapisan di latar gelap.

### Responsive & Theme Behavior
- Pendekatan mobile-first dengan penyesuaian progresif pada `sm`, `md`, `lg`.
- Mode tema berbasis class (`.dark`) dengan pasangan token terang/gelap yang setara secara fungsi.
- Tidak mengubah pola komponen inti antar tema; hanya menyesuaikan kontras dan surface.

## 6. Design System Notes for Stitch Generation

Gunakan bahasa deskriptif ini saat membuat prompt Stitch agar konsisten dengan frontend ini:

### Atmosphere Phrases
- "Structured enterprise interface with calm spacing and trust-first indigo accents"
- "Practical modern dashboard with clear hierarchy and lightweight depth"
- "Public-facing marketplace tone that feels warm but still operationally precise"

### Color Phrases
- "Indigo Komando (`#4338CA`) for primary actions and active emphasis"
- "Kabut Netral (`#F8FAFC`) for subtle page surfaces and section separation"
- "Malam Dasar (`#0F172A`) and Slate Kartu Gelap (`#1E293B`) for dark-mode foundations"
- "Abu Naratif (`#334155`) for secondary text and descriptive copy"

### Component Prompt Framing
- "Use gently rounded data cards with thin neutral borders and whisper-soft elevation"
- "Design pill-shaped CTAs for public sections, and rounded-xl action buttons for dashboard workflows"
- "Keep forms clean with subtle borders, primary-accent focus states, and clear helper/error text"
- "Structure pages with reusable section shells, card surfaces, and consistent spacing rhythm"

### Prompt Constraints
- Prioritaskan token semantik (`brand-*`, `surface-*`, `foreground-*`) daripada warna acak.
- Pertahankan kompatibilitas light/dark mode.
- Hindari estetika dekoratif berlebihan; fokus pada keterbacaan, status, dan alur tindakan.
