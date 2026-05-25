-- Add refund_policy column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS refund_policy TEXT DEFAULT 'All sales are final. No refunds are provided for digital downloads or virtual bookings. For physical merchandise, please contact the creator directly.';
