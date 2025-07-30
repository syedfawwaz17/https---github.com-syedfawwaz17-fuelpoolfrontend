import api from "./api";
import { z } from "zod";

export const MLPredictionLogDtoSchema = z.object({
  id: z.string().optional(),
  predictionType: z.string(),
  inputPayload: z.string(), // JSON string
  outputPayload: z.string(), // JSON string
  confidenceScore: z.number().nullable().optional(),
  timestamp: z.string().optional(), // ISO 8601 string
});

export type MLPredictionLogDto = z.infer<typeof MLPredictionLogDtoSchema>;

/**
 * Logs an ML prediction event to the backend.
 * @param predictionData The data for the prediction log.
 * @returns A promise that resolves to the saved log DTO.
 */
export async function logPrediction(predictionData: Omit<MLPredictionLogDto, 'id' | 'timestamp'>): Promise<MLPredictionLogDto> {
  try {
    const response = await api.post('/ml-predictions/log', predictionData);
    const validatedLog = MLPredictionLogDtoSchema.safeParse(response.data);

    if (!validatedLog.success) {
        console.error("Invalid prediction log data structure from API:", validatedLog.error);
        throw new Error('Invalid data received from server after logging prediction.');
    }
    
    return validatedLog.data;
  } catch (error) {
    console.error('Failed to log ML prediction:', error);
    // Depending on requirements, you might want to re-throw the error
    // or handle it gracefully. Here we re-throw to let the caller know.
    throw new Error('Could not log the ML prediction.');
  }
}
