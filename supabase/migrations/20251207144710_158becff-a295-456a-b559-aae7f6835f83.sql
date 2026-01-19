-- Add industry_field and remarks columns to cards table
ALTER TABLE public.cards
ADD COLUMN industry_field text DEFAULT NULL,
ADD COLUMN remarks text DEFAULT NULL;