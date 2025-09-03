# Schema Columns

Summary of tables defined in `migrations/` and their columns.

## tenants
- id SERIAL PRIMARY KEY
- name VARCHAR(255) NOT NULL
- legal_entity VARCHAR(255)
- domain VARCHAR(255) UNIQUE NOT NULL
- pic_name VARCHAR(255)
- pic_phone VARCHAR(50)
- pic_email VARCHAR(255)
- type VARCHAR(50) NOT NULL
- status VARCHAR(50) NOT NULL DEFAULT 'active'
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- primary_plan_id INT
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## roles
- id SERIAL PRIMARY KEY
- name VARCHAR(100) NOT NULL
- description TEXT
- jenis_tenant VARCHAR(50) NOT NULL
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## tenant_roles
- id SERIAL PRIMARY KEY
- tenant_id INTEGER NOT NULL REFERENCES tenants(id)
- role_id INTEGER NOT NULL REFERENCES roles(id)
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## users
- id SERIAL PRIMARY KEY
- tenant_id INT NOT NULL REFERENCES tenants(id)
- tenant_role_id INT NOT NULL REFERENCES tenant_roles(id)
- email VARCHAR(255) NOT NULL UNIQUE
- password_hash TEXT NOT NULL
- full_name VARCHAR(255)
- status BOOLEAN NOT NULL DEFAULT TRUE
- last_login TIMESTAMP NULL
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## role_users
- id SERIAL PRIMARY KEY
- user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE
- tenant_id INTEGER NOT NULL REFERENCES tenants(id)
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## casbin_rule
- id SERIAL PRIMARY KEY
- ptype VARCHAR(255)
- v0 VARCHAR(255)
- v1 VARCHAR(255)
- v2 VARCHAR(255)
- v3 VARCHAR(255)
- v4 VARCHAR(255)
- v5 VARCHAR(255)

## modules
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- name VARCHAR(100) NOT NULL
- code VARCHAR(50) NOT NULL UNIQUE
- description TEXT
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## tenant_modules
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- tenant_id INT NOT NULL REFERENCES tenants(id)
- module_id UUID NOT NULL REFERENCES modules(id)
- status VARCHAR(20) NOT NULL
- start_date DATE
- end_date DATE
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## user_tenant_access
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- user_id INT NOT NULL REFERENCES users(id)
- tenant_id INT NOT NULL REFERENCES tenants(id)
- tenant_role_id INT NOT NULL REFERENCES tenant_roles(id)
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## refresh_tokens
- token VARCHAR(64) PRIMARY KEY
- user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- expires_at TIMESTAMP NOT NULL

## plans
- id SERIAL PRIMARY KEY
- name VARCHAR(100) NOT NULL
- type VARCHAR(20) NOT NULL
- price NUMERIC(10,2) NOT NULL
- status VARCHAR(20) NOT NULL
- module_code VARCHAR(50)
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## tenant_plans
- tenant_id INT NOT NULL REFERENCES tenants(id)
- plan_id INT NOT NULL REFERENCES plans(id)
- is_primary BOOLEAN NOT NULL DEFAULT FALSE
- PRIMARY KEY (tenant_id, plan_id)

## tenant_subscriptions
- id SERIAL PRIMARY KEY
- tenant_id INT NOT NULL REFERENCES tenants(id)
- plan_id INT NOT NULL REFERENCES plans(id)
- start_date DATE NOT NULL
- end_date DATE
- status VARCHAR(20) NOT NULL DEFAULT 'active'
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## invoices
- id SERIAL PRIMARY KEY
- tenant_id INT NOT NULL REFERENCES tenants(id)
- number VARCHAR(50) NOT NULL UNIQUE
- subscription_id INT REFERENCES tenant_subscriptions(id)
- total NUMERIC(10,2) NOT NULL
- status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue'))
- issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- due_date TIMESTAMP NOT NULL

## invoice_items
- id SERIAL PRIMARY KEY
- invoice_id INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE
- description TEXT NOT NULL
- quantity INT NOT NULL DEFAULT 1
- price NUMERIC(10,2) NOT NULL

## payments
- id SERIAL PRIMARY KEY
- invoice_id INT NOT NULL REFERENCES invoices(id)
- amount NUMERIC(10,2) NOT NULL
- paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- method VARCHAR(50)
- proof_url TEXT NOT NULL
- status VARCHAR(50)
- gateway VARCHAR(50)
- external_id VARCHAR(100)
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## cash_transactions
- id SERIAL PRIMARY KEY
- tenant_id INT NOT NULL REFERENCES tenants(id)
- transaction_date TIMESTAMP NOT NULL
- type VARCHAR(20) NOT NULL
- category VARCHAR(100) NOT NULL
- amount NUMERIC(10,2) NOT NULL
- payment_method VARCHAR(100) NOT NULL
- description VARCHAR(255)
- created_by INT
- updated_by INT
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## ledger_entries
- id SERIAL PRIMARY KEY
- transaction_id INT NOT NULL REFERENCES cash_transactions(id) ON DELETE CASCADE
- account_code VARCHAR(100) NOT NULL
- account_name VARCHAR(255) NOT NULL
- debit NUMERIC(10,2) NOT NULL DEFAULT 0
- credit NUMERIC(10,2) NOT NULL DEFAULT 0

## transaction_history
- id SERIAL PRIMARY KEY
- transaction_id INT NOT NULL REFERENCES cash_transactions(id) ON DELETE CASCADE
- changed_by INT
- old_values JSONB
- new_values JSONB
- changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## notifications
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- tenant_id INT NOT NULL REFERENCES tenants(id)
- user_id INT NULL REFERENCES users(id)
- channel VARCHAR(20) NOT NULL
- type VARCHAR(20) NOT NULL
- title VARCHAR(100) NOT NULL
- body TEXT NOT NULL
- status VARCHAR(20) NOT NULL
- created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- sent_at TIMESTAMP NULL
- read_at TIMESTAMP NULL

## status_audits
- id SERIAL PRIMARY KEY
- entity_type VARCHAR(50) NOT NULL
- entity_id INT NOT NULL
- old_status VARCHAR(20)
- new_status VARCHAR(20)
- changed_by INT
- changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## module_usage_logs
- tenant_id INT NOT NULL REFERENCES tenants(id)
- module_code VARCHAR(50) NOT NULL
- count INT NOT NULL DEFAULT 0
- last_used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- PRIMARY KEY (tenant_id, module_code)
