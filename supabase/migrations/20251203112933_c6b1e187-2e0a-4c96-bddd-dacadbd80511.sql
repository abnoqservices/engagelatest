-- Create storage bucket for card images
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-images', 'card-images', true);

-- Storage policies for card images
CREATE POLICY "Anyone can upload card images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'card-images');

CREATE POLICY "Anyone can view card images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'card-images');

CREATE POLICY "Anyone can delete card images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'card-images');

-- Create cards table
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  company_name TEXT,
  person_name TEXT,
  designation TEXT,
  phone_numbers TEXT[] DEFAULT '{}',
  email TEXT,
  website TEXT,
  full_address TEXT,
  city TEXT,
  pincode TEXT,
  social_handles JSONB DEFAULT '{
    "linkedin": null,
    "instagram": null,
    "facebook": null,
    "x": null,
    "youtube": null,
    "other": null
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for now - can add auth later)
CREATE POLICY "Anyone can view cards"
ON public.cards
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert cards"
ON public.cards
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update cards"
ON public.cards
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete cards"
ON public.cards
FOR DELETE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_cards_created_at ON public.cards(created_at DESC);
CREATE INDEX idx_cards_company_name ON public.cards(company_name);
CREATE INDEX idx_cards_person_name ON public.cards(person_name);
CREATE INDEX idx_cards_city ON public.cards(city);
CREATE INDEX idx_cards_pincode ON public.cards(pincode);