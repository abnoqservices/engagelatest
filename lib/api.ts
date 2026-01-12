import axiosClient from "@/lib/axiosClient";

export interface CardData {
  id: string;
  user_id: string | null;
  image_url: string | null;
  company_name: string | null;
  person_name: string | null;
  designation: string | null;
  phone_numbers: string[];
  email: string | null;
  website: string | null;
  full_address: string | null;
  city: string | null;
  pincode: string | null;
  social_handles: {
    linkedin: string | null;
    instagram: string | null;
    facebook: string | null;
    x: string | null;
    youtube: string | null;
    other: string | null;
  } | null;
  industry_field: string | null;
  remarks: string | null;
  created_at: string;
}

export interface ScanResponse {
  success: boolean;
  data?: Omit<CardData, 'id' | 'created_at' | 'image_url'>;
  card_id?: string;
  image_url?: string;
  error?: string;
}

export interface CardsListResponse {
  success: boolean;
  data: CardData[];
  total: number;
  limit: number;
  offset: number;
  error?: string;
}

// Scan a business card using AI
export async function scanCard(imageData: string): Promise<ScanResponse> {
  const response = await axiosClient.post<ScanResponse>('/api/scan-card', {
    imageData,
  });

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to scan card');
  }

  return response.data;
}

// Get all cards (with optional filters)
export async function getAllCards(params?: {
  search?: string;
  city?: string;
  pincode?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: CardData[]; total: number }> {
  const response = await axiosClient.get('/api/cards', { params });

  return {
    data: response.data.data || [],
    total: response.data.total || 0,
  };
}

// Get a single card by ID
export async function getCard(id: string): Promise<CardData | null> {
  try {
    const response = await axiosClient.get<CardData>(`/api/cards/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw new Error(error.response?.data?.message || 'Failed to fetch card');
  }
}

// Update a card
export async function updateCard(
  id: string,
  updates: Partial<Omit<CardData, 'id' | 'created_at' | 'user_id'>>
): Promise<CardData> {
  const response = await axiosClient.patch<CardData>(`/api/cards/${id}`, updates);
  return response.data;
}

// Delete a card
export async function deleteCard(id: string): Promise<void> {
  await axiosClient.delete(`/api/cards/${id}`);
}