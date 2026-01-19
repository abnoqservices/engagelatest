-- Add user_id column to cards table
ALTER TABLE public.cards ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can delete cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can insert cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can update cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can view cards" ON public.cards;

-- Create new RLS policies for user-specific access
CREATE POLICY "Users can view their own cards"
ON public.cards
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
ON public.cards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON public.cards
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
ON public.cards
FOR DELETE
USING (auth.uid() = user_id);