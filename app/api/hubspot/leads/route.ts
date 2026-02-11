// app/api/hubspot/leads/route.ts
// Renamed concept: this now handles Contacts (standard for people/leads)
// If you truly need the new Leads object → see notes at bottom

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hubspot_access_token')?.value;
  console.log('Access token retrieved:', !!token);
  if (!token) {
    throw new Error('Unauthorized - No HubSpot access token found');
  }
  return token;
}

// Use Contacts endpoint (standard for people / leads data)
const HUBSPOT_CONTACTS_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';

export async function GET(request: NextRequest) {
  try {
    const token = await getAccessToken();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const after = searchParams.get('after') || undefined;

    const properties = [
      'firstname',
      'lastname',
      'email',
      'company',          // or 'company_name' if preferred
      'phone',
      'lifecyclestage',
      'createdate',
      'hs_lastmodifieddate',
    ].join(',');

    const url = new URL(HUBSPOT_CONTACTS_URL);
    url.searchParams.set('limit', limit);
    url.searchParams.set('properties', properties);
    if (after) url.searchParams.set('after', after);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('HubSpot GET contacts failed:', res.status, errorText);
      let errorMessage = `HubSpot API error: ${res.status}`;
      try {
        const errJson = JSON.parse(errorText);
        errorMessage = errJson.message || errorMessage;
      } catch {}
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Contacts GET exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAccessToken();
    const body = await request.json();

    const { properties } = body;
    if (!properties || !properties.email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required when creating/updating a contact' },
        { status: 400 }
      );
    }

    // Optional: simple deduplication / upsert logic by email
    // HubSpot can upsert by email if you use unique property in batch/upsert, but here simple create
    // (for true upsert → use /crm/v3/objects/contacts/batch/upsert)

    const payload = {
      properties: {
        email: properties.email.trim(),
        firstname: properties.firstname?.trim() || undefined,
        lastname: properties.lastname?.trim() || undefined,
        company: properties.company?.trim() || undefined, // or use associations below for real company link
        phone: properties.phone?.trim() || undefined,
        lifecyclestage: properties.lifecyclestage || 'lead', // or 'subscriber', 'mql', etc.
        // Add any other custom properties you have
        ...properties, // allow extras, but override known ones if needed
      },
    };

    const res = await fetch(HUBSPOT_CONTACTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('HubSpot POST contact failed:', res.status, errorText);
      let errorMessage = `HubSpot API error: ${res.status}`;
      try {
        const errJson = JSON.parse(errorText);
        errorMessage = errJson.message || errorMessage;
      } catch {}
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const created = await res.json();
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Contacts POST exception:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create contact' },
      { status: 500 }
    );
  }
}