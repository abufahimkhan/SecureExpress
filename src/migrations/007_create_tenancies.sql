CREATE TABLE IF NOT EXISTS tenancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tenancy_end_after_start CHECK (end_date IS NULL OR end_date >= start_date)
);
