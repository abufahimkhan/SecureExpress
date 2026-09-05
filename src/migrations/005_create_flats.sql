CREATE TABLE IF NOT EXISTS flats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    flat_number VARCHAR(50) NOT NULL,
    floor INTEGER,
    monthly_rent NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'vacant',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT flats_unique_property_flat
        UNIQUE (property_id, flat_number)
);