
# 📦 Struktur Database Koperasi Serba Usaha

Berikut adalah struktur tabel lengkap berdasarkan seluruh modul sistem KSU.

---

## 1. users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) CHECK (role IN ('admin', 'kasir', 'anggota')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. business_profiles

```sql
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('koperasi', 'umkm', 'bumdes')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. members

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  membership_number VARCHAR(100) UNIQUE,
  status VARCHAR(50) CHECK (status IN ('aktif', 'nonaktif')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 4. units

```sql
CREATE TABLE units (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES business_profiles(id),
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 5. user_unit_access

```sql
CREATE TABLE user_unit_access (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  unit_id UUID REFERENCES units(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 6. products

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  unit_id UUID REFERENCES units(id),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  base_price NUMERIC(12,2),
  stock_quantity INT DEFAULT 0,
  min_stock INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 7. price_tiers

```sql
CREATE TABLE price_tiers (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);
```

## 8. product_prices

```sql
CREATE TABLE product_prices (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  tier_id UUID REFERENCES price_tiers(id),
  price NUMERIC(12,2) NOT NULL
);
```

## 9. contacts

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  price_tier_id UUID REFERENCES price_tiers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 10. savings

```sql
CREATE TABLE savings (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES members(id),
  type VARCHAR(50) CHECK (type IN ('pokok', 'wajib', 'sukarela')),
  scheme VARCHAR(50) CHECK (scheme IN ('konvensional', 'wadiah', 'mudharabah')),
  balance NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 11. savings_transactions

```sql
CREATE TABLE savings_transactions (
  id UUID PRIMARY KEY,
  savings_id UUID REFERENCES savings(id),
  type VARCHAR(10) CHECK (type IN ('deposit', 'withdrawal')),
  amount NUMERIC(12,2) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 12. loans

```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES members(id),
  principal NUMERIC(12,2),
  margin NUMERIC(5,2),
  tenor INT,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'closed')),
  scheme VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 13. loan_repayments

```sql
CREATE TABLE loan_repayments (
  id UUID PRIMARY KEY,
  loan_id UUID REFERENCES loans(id),
  due_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ
);
```

## 14. shu_allocations

```sql
CREATE TABLE shu_allocations (
  id UUID PRIMARY KEY,
  year INT NOT NULL,
  total_amount NUMERIC(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 15. shu_distributions

```sql
CREATE TABLE shu_distributions (
  id UUID PRIMARY KEY,
  allocation_id UUID REFERENCES shu_allocations(id),
  member_id UUID REFERENCES members(id),
  amount NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 16. pos_transactions

```sql
CREATE TABLE pos_transactions (
  id UUID PRIMARY KEY,
  unit_id UUID REFERENCES units(id),
  contact_id UUID REFERENCES contacts(id),
  total_amount NUMERIC(12,2),
  payment_method VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 17. transaction_items

```sql
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES pos_transactions(id),
  product_id UUID REFERENCES products(id),
  quantity INT,
  price NUMERIC(12,2),
  total NUMERIC(12,2)
);
```

## 18. rental_assets

```sql
CREATE TABLE rental_assets (
  id UUID PRIMARY KEY,
  unit_id UUID REFERENCES units(id),
  name VARCHAR(255),
  description TEXT,
  daily_rate NUMERIC(12,2),
  photo_url TEXT
);
```

## 19. rental_bookings

```sql
CREATE TABLE rental_bookings (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES rental_assets(id),
  contact_id UUID REFERENCES contacts(id),
  start_date DATE,
  end_date DATE,
  total_amount NUMERIC(12,2),
  status VARCHAR(50) CHECK (status IN ('booked', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔍 Indexes

Beberapa kolom relasi diberi index untuk mempercepat pencarian:

```sql
CREATE INDEX idx_business_profiles_owner_id ON business_profiles(owner_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_units_business_id ON units(business_id);
CREATE INDEX idx_user_unit_access_user_id ON user_unit_access(user_id);
CREATE INDEX idx_user_unit_access_unit_id ON user_unit_access(unit_id);
CREATE INDEX idx_products_unit_id ON products(unit_id);
CREATE INDEX idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX idx_product_prices_tier_id ON product_prices(tier_id);
CREATE INDEX idx_contacts_price_tier_id ON contacts(price_tier_id);
CREATE INDEX idx_savings_member_id ON savings(member_id);
CREATE INDEX idx_savings_transactions_savings_id ON savings_transactions(savings_id);
CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loan_repayments_loan_id ON loan_repayments(loan_id);
CREATE INDEX idx_shu_distributions_allocation_id ON shu_distributions(allocation_id);
CREATE INDEX idx_shu_distributions_member_id ON shu_distributions(member_id);
CREATE INDEX idx_pos_transactions_unit_id ON pos_transactions(unit_id);
CREATE INDEX idx_pos_transactions_contact_id ON pos_transactions(contact_id);
CREATE INDEX idx_pos_transactions_created_by ON pos_transactions(created_by);
CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product_id ON transaction_items(product_id);
CREATE INDEX idx_rental_assets_unit_id ON rental_assets(unit_id);
CREATE INDEX idx_rental_bookings_asset_id ON rental_bookings(asset_id);
CREATE INDEX idx_rental_bookings_contact_id ON rental_bookings(contact_id);
```

## ⚙️ Trigger updated_at

Tabel yang memiliki kolom `updated_at` menggunakan trigger berikut agar nilainya
otomatis diperbarui setiap ada perubahan:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_members_updated_at
BEFORE UPDATE ON members
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```
