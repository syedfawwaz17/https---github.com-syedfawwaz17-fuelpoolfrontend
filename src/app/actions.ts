'use server';

import { suggestMeetingPoint, type SuggestMeetingPointOutput } from '@/ai/flows/suggest-meeting-point';
import { z } from 'zod';

export interface FormState {
  status: 'idle' | 'success' | 'error';
  message: string;
  result: SuggestMeetingPointOutput | null;
}

const SuggestMeetingPointClientSchema = z.object({
  locations: z.array(z.string().min(3, 'Location must be at least 3 characters long.')).min(2, 'At least two locations are required.'),
});

export async function suggestMeetingPointAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const locations = formData.getAll('locations') as string[];
  const validatedFields = SuggestMeetingPointClientSchema.safeParse({ locations: locations.filter(l => l) });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors.locations?.join(', ') || 'Validation failed.',
      result: null,
    };
  }

  try {
    const result = await suggestMeetingPoint({ locations: validatedFields.data.locations });
    return {
      status: 'success',
      message: 'Successfully found a meeting point.',
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'An error occurred while suggesting a meeting point. Please try again.',
      result: null,
    };
  }
}
