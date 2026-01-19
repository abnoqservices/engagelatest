import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const cardId = pathParts[pathParts.length - 1];
  const isSpecificCard = cardId && cardId !== 'cards' && cardId.match(/^[0-9a-f-]{36}$/i);

  try {
    // GET /cards - List all cards
    if (req.method === 'GET' && !isSpecificCard) {
      const search = url.searchParams.get('search') || '';
      const city = url.searchParams.get('city') || '';
      const pincode = url.searchParams.get('pincode') || '';
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`person_name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      if (city) {
        query = query.ilike('city', `%${city}%`);
      }
      if (pincode) {
        query = query.ilike('pincode', `%${pincode}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data, 
          total: count,
          limit,
          offset
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /cards/:id - Get single card
    if (req.method === 'GET' && isSpecificCard) {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Card not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE /cards/:id - Delete card
    if (req.method === 'DELETE' && isSpecificCard) {
      // First get the card to get image URL
      const { data: card } = await supabase
        .from('cards')
        .select('image_url')
        .eq('id', cardId)
        .maybeSingle();

      // Delete from database
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        throw error;
      }

      // Try to delete image from storage if exists
      if (card?.image_url) {
        try {
          const fileName = card.image_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('card-images')
              .remove([fileName]);
          }
        } catch (e) {
          console.log('Could not delete image:', e);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Card deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT /cards/:id - Update card
    if (req.method === 'PUT' && isSpecificCard) {
      const updates = await req.json();
      
      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cards function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
