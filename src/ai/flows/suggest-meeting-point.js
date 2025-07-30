
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting an optimal meeting point
 * for carpool participants based on their locations.
 *
 * - suggestMeetingPoint - A function that takes an array of locations and returns
 *   the optimal meeting point.
 * - SuggestMeetingPointInput - The input type for the suggestMeetingPoint function,
 *   an array of location strings.
 * - SuggestMeetingPointOutput - The return type for the suggestMeetingPoint function,
 *   an object containing the suggested meeting point (address) and a justification.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMeetingPointInputSchema = z.object({
  locations: z
    .array(z.string().describe('A location of a carpool participant'))
    .describe('An array of carpool participant locations.'),
});


const SuggestMeetingPointOutputSchema = z.object({
  meetingPoint: z.string().describe('The suggested optimal meeting point address.'),
  justification: z
    .string()
    .describe('The justification for choosing the suggested meeting point.'),
});


export async function suggestMeetingPoint(input) {
  return suggestMeetingPointFlow(input);
}

const suggestMeetingPointPrompt = ai.definePrompt({
  name: 'suggestMeetingPointPrompt',
  input: {schema: SuggestMeetingPointInputSchema},
  output: {schema: SuggestMeetingPointOutputSchema},
  prompt: `You are a carpool meeting point optimizer. Given the following list of locations of carpool participants, suggest an optimal meeting point that minimizes travel time and distance for everyone.

Locations:
{{#each locations}}- {{{this}}}
{{/each}}

Consider factors such as:
- Distance to each participant
- Traffic conditions
- Availability of parking
- Accessibility by public transport

Meeting Point:`,
});

const suggestMeetingPointFlow = ai.defineFlow(
  {
    name: 'suggestMeetingPointFlow',
    inputSchema: SuggestMeetingPointInputSchema,
    outputSchema: SuggestMeetingPointOutputSchema,
  },
  async input => {
    const {output} = await suggestMeetingPointPrompt(input);
    return output;
  }
);
