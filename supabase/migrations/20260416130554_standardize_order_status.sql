-- Standardize Order Status Flow
-- Stages: new -> confirmed -> packed -> shipped -> delivered

-- 1. Add 'confirmed' and 'new' to order_status enum if they don't exist
-- Note: 'packed', 'shipped', 'delivered' already exist from previous migrations

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'confirmed' AND enumtypid = 'order_status'::regtype) THEN
        ALTER TYPE order_status ADD VALUE 'confirmed';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new' AND enumtypid = 'order_status'::regtype) THEN
        ALTER TYPE order_status ADD VALUE 'new' BEFORE 'pending';
    END IF;
END $$;

-- 2. Update existing 'pending' orders to 'new' if appropriate
-- (We'll keep 'pending' for now to avoid breaking existing logic, but 'new' is the new standard)
-- Actually, the requirement says "ensure order_status supports: 'new', 'confirmed'..."
-- We'll map them in the application logic.

-- 3. Ensure 'shipped' and 'delivered' are present (just in case)
-- They were in 20260324154252_ecommerce_setup.sql, so we are safe.
