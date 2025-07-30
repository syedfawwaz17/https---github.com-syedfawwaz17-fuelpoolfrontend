'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting the fare for a ride.
 *
 * - predictFare - A function that takes start and end locations and returns a fare prediction.
 * - PredictFareInput - The input type for the predictFare function.
 * - PredictFareOutput - The return type for the predictFare function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PredictFareInputSchema = z.object({
  startLocation: z.string().describe('The starting location of the ride.'),
  endLocation: z.string().describe('The destination of the ride.'),
});
export type PredictFareInput = z.infer<typeof PredictFareInputSchema>;

export const PredictFareOutputSchema = z.object({
  predictedTotalCost: z.number().describe('The total predicted cost for the ride.'),
  farePerPerson: z.number().describe('The predicted fare per person for the ride.'),
});
export type PredictFareOutput = z.infer<typeof PredictFareOutputSchema>;


export async function predictFare(input: PredictFareInput): Promise<PredictFareOutput> {
  return predictFareFlow(input);
}

const predictFarePrompt = ai.definePrompt({
  name: 'predictFarePrompt',
  input: {schema: PredictFareInputSchema},
  output: {schema: PredictFareOutputSchema},
  prompt: `You are a fare prediction model for a carpooling app. Your goal is to estimate the total cost and per-person fare for a ride based on the distance, estimated fuel consumption, and potential tolls between the start and end locations.

Ride Details:
- Start Location: {{{startLocation}}}
- End Location: {{{endLocation}}}

Please provide a realistic cost estimate. Assume a standard car with average fuel efficiency. The per-person fare should be based on a 4-person carpool.
`,
});

const predictFareFlow = ai.defineFlow(
  {
    name: 'predictFareFlow',
    inputSchema: PredictFareInputSchema,
    outputSchema: PredictFareOutputSchema,
  },
  async (input) => {
    const {output} = await predictFarePrompt(input);
    return output!;
  }
);
