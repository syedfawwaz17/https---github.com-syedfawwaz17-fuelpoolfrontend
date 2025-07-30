
import api from "./api";
import { z } from "zod";

export const FuelPriceRecordSchema = z.object({
  id: z.string(),
  city: z.string(),
  fuelType: z.string(),
  pricePerLitre: z.number(),
  apiSource: z.string(),
  timestamp: z.string(), // ISO 8601 string
});



/**
 * Fetches the latest fuel price from the backend API.
 * @param {string} city The city to get the fuel price for.
 * @param {'petrol' | 'diesel'} fuelType The type of fuel ('petrol' or 'diesel').
 * @returns {Promise<import('./fuel').FuelPriceRecord[]>} A promise that resolves to an array of fuel price records.
 */
export async function getLatestFuelPrice(city, fuelType) {
  try {
    const response = await api.get('/fuel-prices/latest', {
      params: { city, fuelType },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch fuel prices:', error);
    // Depending on requirements, you might want to re-throw the error
    // or return a default/empty value.
    throw new Error('Could not fetch fuel price data.');
  }
}
