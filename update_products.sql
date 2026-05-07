ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hidden_from_network BOOLEAN DEFAULT false;
