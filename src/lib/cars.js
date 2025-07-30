
import api from "./api";
import { z } from "zod";

export const CarFeaturesDtoSchema = z.object({
  ac: z.boolean().optional(),
  ladiesOnly: z.boolean().optional(),
});

export const CarDtoSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  model: z.string(),
  registrationNumber: z.string(),
  fuelType: z.string(),
  mileageKmpl: z.number().optional().nullable(),
  mileageProof: z.array(z.string()).optional(),
  seatingCapacity: z.number(),
  year: z.number(),
  features: CarFeaturesDtoSchema.optional(),
  photos: z.array(z.string()).optional(),
  createdAt: z.string(), // ISO 8601 string
  updatedAt: z.string(), // ISO 8601 string
});



/**
 * Fetches the cars for a specific owner from the backend API.
 * @param {string} ownerId The ID of the car owner.
 * @returns {Promise<import('./cars').CarDto[]>} A promise that resolves to an array of car DTOs.
 */
export async function getCarsByOwner(ownerId) {
  try {
    const response = await api.get(`/cars/owner/${ownerId}`);
    const validatedCars = z.array(CarDtoSchema).safeParse(response.data);

    if (!validatedCars.success) {
      console.error("Invalid car data structure from API:", validatedCars.error);
      return [];
    }

    return validatedCars.data;
  } catch (error) {
    console.error(`Failed to fetch cars for owner ${ownerId}:`, error);
    throw new Error('Could not fetch user cars.');
  }
}
