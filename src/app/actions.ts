'use server';

import { suggestMeetingPoint, type SuggestMeetingPointOutput } from '@/ai/flows/suggest-meeting-point';
import { predictFare, type PredictFareOutput } from '@/ai/flows/predict-fare';
import { z } from 'zod';
import { logPrediction } from '@/lib/ml';

export interface MeetingPointFormState {
  status: 'idle' | 'success' | 'error';
  message: string;
  result: SuggestMeetingPointOutput | null;
}

const SuggestMeetingPointClientSchema = z.object({
  locations: z.array(z.string().min(3, 'Location must be at least 3 characters long.')).min(2, 'At least two locations are required.'),
});

export async function suggestMeetingPointAction(
  prevState: MeetingPointFormState,
  formData: FormData
): Promise<MeetingPointFormState> {
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
    
    // Log the prediction
    await logPrediction({
        predictionType: 'MEETING_POINT_SUGGESTION',
        inputPayload: JSON.stringify({ locations: validatedFields.data.locations }),
        outputPayload: JSON.stringify(result),
        confidenceScore: null,
    });

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


export interface FareEstimatorFormState {
  status: 'idle' | 'success' | 'error';
  message: string;
  result: PredictFareOutput | null;
}

const PredictFareClientSchema = z.object({
  startLocation: z.string().min(3, 'Start location must be at least 3 characters long.'),
  endLocation: z.string().min(3, 'End location must be at least 3 characters long.'),
  fuelType: z.enum(['petrol', 'diesel', 'any']),
});

export async function predictFareAction(
  prevState: FareEstimatorFormState,
  formData: FormData
): Promise<FareEstimatorFormState> {
  
  const validatedFields = PredictFareClientSchema.safeParse({ 
    startLocation: formData.get('startLocation'),
    endLocation: formData.get('endLocation'),
    fuelType: formData.get('fuelType'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = errors.startLocation?.[0] || errors.endLocation?.[0] || 'Validation failed.';
    return {
      status: 'error',
      message: errorMessage,
      result: null,
    };
  }

  try {
    const result = await predictFare(validatedFields.data);
    
    // Log the prediction
    await logPrediction({
        predictionType: 'FARE_PREDICTION',
        inputPayload: JSON.stringify(validatedFields.data),
        outputPayload: JSON.stringify(result),
        confidenceScore: null, 
    });
    
    return {
      status: 'success',
      message: 'Successfully estimated fare.',
      result,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      status: 'error',
      message: `An error occurred while estimating the fare: ${errorMessage}`,
      result: null,
    };
  }
}
