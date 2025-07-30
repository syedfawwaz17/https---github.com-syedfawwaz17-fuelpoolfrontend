'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting the fare for a ride.
 *
 * - predictFare - A function that takes start and end locations and returns a fare prediction.
 * - PredictFareInput - The input type for the predictFare function.
 * - PredictFareOutput - The return type for the predictFare function.
 */

import {ai} from '@/ai/genkit';
import {getLatestFuelPrice, FuelPriceRecordSchema, type FuelPriceRecord} from '@/lib/fuel';
import {z} from 'genkit';

export const PredictFareInputSchema = z.object({
  startLocation: z.string().describe('The starting location of the ride.'),
  endLocation: z.string().describe('The destination of the ride.'),
  fuelType: z.enum(['petrol', 'diesel', 'any']).default('any').describe('The preferred fuel type.'),
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

const getFuelPriceTool = ai.defineTool(
  {
    name: 'getFuelPrice',
    description: 'Gets the latest fuel price for a given city and fuel type.',
    inputSchema: z.object({
        city: z.string().describe('The city to get the fuel price for.'),
        fuelType: z.enum(['petrol', 'diesel']).describe('The type of fuel.'),
    }),
    outputSchema: z.array(FuelPriceRecordSchema),
  },
  async ({ city, fuelType }) => {
    return getLatestFuelPrice(city, fuelType);
  }
);


const predictFarePrompt = ai.definePrompt({
  name: 'predictFarePrompt',
  input: {schema: PredictFareInputSchema},
  output: {schema: PredictFareOutputSchema},
  tools: [getFuelPriceTool],
  prompt: `You are a fare prediction model for a carpooling app. Your goal is to estimate the total cost and per-person fare for a ride.

To do this, you MUST first identify the major city for the start or end location. Then, use the getFuelPrice tool to fetch the current price of fuel for that city.

Base your final calculation on the distance, estimated fuel consumption, potential tolls, and the real-time fuel price you fetched.

Ride Details:
- Start Location: {{{startLocation}}}
- End Location: {{{endLocation}}}
- Fuel Type: {{{fuelType}}}

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
