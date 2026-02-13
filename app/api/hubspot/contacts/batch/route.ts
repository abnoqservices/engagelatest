// app/api/hubspot/contacts/batch/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hubspot_access_token')?.value;
  if (!token) {
    throw new Error('Unauthorized - No HubSpot access token found');
  }
  return token;
}

const HUBSPOT_BATCH_UPSERT = 'https://api.hubapi.com/crm/v3/objects/contacts';

export async function POST(request: NextRequest) {
  try {
    const token = await getAccessToken();

    // === TEMPORARY STATIC TEST DATA (remove or comment out later) ===
    const staticTestData = {
      inputs: [
        {
          id: "test1@example.com",
          properties: {
            email: "test1@example.com",
            firstname: "Test",
            lastname: "One",
            phone: "+911234567891",
            company: "Test Corp A",
            website: "https://example.com"
          }
        },
        {
          id: "test2@example.com",
          properties: {
            email: "test2@example.com",
            firstname: "Test",
            lastname: "Two",
            phone: "+912345678912",
            company: "Demo Inc",
            lifecyclestage: "lead"
          }
        },
        {
          id: "surendra.yadav@example.com",
          properties: {
            email: "surendra.yadav@example.com",
            firstname: "Surendra",
            lastname: "Yadav",
            phone: "+917755844831",
            company: "MyCompany Lucknow",
            city: "Lucknow",
            state: "Uttar Pradesh"
          }
        },
        {
          id: "john.doe@example.com",
          properties: {
            email: "john.doe@example.com",
            firstname: "John",
            lastname: "Doe",
            phone: "+12025550123",
            company: "Global Tech",
            jobtitle: "Developer"
          }
        },
        {
          id: "anna.smith@example.com",
          properties: {
            email: "anna.smith@example.com",
            firstname: "Anna",
            lastname: "Smith",
            phone: "+447911123456",
            company: "Creative Solutions",
            country: "United Kingdom"
          }
        },
        // You can add more if you want (max 100 per batch)
      ],
      idProperty: "email"
    };

    // Use static data instead of request body for testing
    const rawBody = staticTestData;   // <--- switch here for testing

    // For real use later, comment out the line above and uncomment this:
    // const rawBody = await request.json();

    console.log('Using STATIC test data for this call');
    console.log('RAW BODY (static):', JSON.stringify(rawBody, null, 2));

    const inputsFromBody = Array.isArray(rawBody.inputs) ? rawBody.inputs : [];
    const idProperty = rawBody.idProperty || 'email';

    if (inputsFromBody.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing or empty 'inputs' array" },
        { status: 400 }
      );
    }

    if (inputsFromBody.length > 100) {
      return NextResponse.json(
        { success: false, message: "HubSpot max 100 per batch" },
        { status: 400 }
      );
    }

    const validInputs = inputsFromBody.filter((item: any) => {
      if (!item?.id || typeof item.id !== 'string') return false;
      if (!item?.properties || typeof item.properties !== 'object') return false;
      const idValue = item.properties[idProperty];
      return idValue && typeof idValue === 'string';
    });

    if (validInputs.length === 0) {
      return NextResponse.json(
        { success: false, message: `No items have valid id + ${idProperty} property` },
        { status: 400 }
      );
    }

    const payload = { inputs: validInputs };

    console.log('FINAL PAYLOAD TO HUBSPOT (body):', JSON.stringify(payload, null, 2));
    console.log('Using idProperty in query:', idProperty);

    const hubspotUrl = `https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert?idProperty=${encodeURIComponent(idProperty)}`;

    const hubspotRes = await fetch(hubspotUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Get response text first (works for both success and error)
    const responseText = await hubspotRes.text();
    console.log('HubSpot Response Status:', hubspotRes.status);
    console.log('HubSpot Response Text:', responseText);

    // Handle error responses
    if (!hubspotRes.ok) {
      let errorMessage = `HubSpot API error: ${hubspotRes.status}`;
      let errorDetails = null;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || JSON.stringify(errorData);
        errorDetails = errorData;
      } catch {
        // If response is not JSON, use raw text
        errorMessage = responseText || errorMessage;
      }
      
      console.error('HubSpot API Error:', errorMessage);
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          details: errorDetails,
          status: hubspotRes.status 
        },
        { status: hubspotRes.status }
      );
    }

    // Parse successful response
    let hubspotData;
    try {
      hubspotData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse HubSpot success response:', parseErr);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid JSON response from HubSpot',
          rawResponse: responseText.substring(0, 500) // Limit length
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${hubspotData.results?.length || 0} contacts`,
      data: hubspotData,
    });

  } catch (err: any) {
    console.error('Server-side error:', err);
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || 'Internal error',
        error: err.toString()
      },
      { status: 500 }
    );
  }
}