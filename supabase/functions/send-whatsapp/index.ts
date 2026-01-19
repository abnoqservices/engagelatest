import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  phoneNumbers: string[];
  personName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumbers, personName }: WhatsAppRequest = await req.json();
    
    const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (!accessToken || !phoneNumberId) {
      throw new Error('WhatsApp credentials not configured');
    }

    if (!phoneNumbers || phoneNumbers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No phone numbers to message' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = `Hi ${personName || 'there'}, it was great visiting your booth today at the International Hardware Fair India!

We're building something groundbreaking - Pexifly, an AI-powered, QR-based event intelligence system designed to help exhibitors capture smarter leads, understand visitor behavior, and automate follow-ups like never before.

It's still under wraps and not publicly launched yet…
But because we connected at your booth, you're now officially on our exclusive early-access list.

Stay tuned - something big is coming that will transform how exhibitors manage products, leads, and engagement forever.
— Team Pexifly`;

    const results = [];

    for (const phoneNumber of phoneNumbers) {
      // Clean phone number - remove spaces, dashes, and ensure it has country code
      let cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
      
      // If number doesn't start with +, assume India (+91)
      if (!cleanNumber.startsWith('+')) {
        if (cleanNumber.startsWith('0')) {
          cleanNumber = '91' + cleanNumber.substring(1);
        } else if (!cleanNumber.startsWith('91')) {
          cleanNumber = '91' + cleanNumber;
        }
      } else {
        cleanNumber = cleanNumber.substring(1); // Remove the + for API
      }

      console.log(`Sending WhatsApp message to: ${cleanNumber}`);

      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: cleanNumber,
              type: 'text',
              text: { body: message },
            }),
          }
        );

        const data = await response.json();
        
        if (response.ok) {
          console.log(`Message sent successfully to ${cleanNumber}:`, data);
          results.push({ phoneNumber: cleanNumber, success: true, messageId: data.messages?.[0]?.id });
        } else {
          console.error(`Failed to send to ${cleanNumber}:`, data);
          results.push({ phoneNumber: cleanNumber, success: false, error: data.error?.message || 'Unknown error' });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error sending to ${cleanNumber}:`, err);
        results.push({ phoneNumber: cleanNumber, success: false, error: errorMessage });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${successCount}/${phoneNumbers.length} messages`,
        results 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('WhatsApp function error:', err);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
