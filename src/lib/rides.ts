import api from "./api";
import { z } from "zod";

export const LocationSchema = z.object({
  address: z.string(),
  coordinates: z.array(z.number()).optional(),
});

export const RideSchema = z.object({
  id: z.string(),
  pickupLocation: LocationSchema,
  destination: LocationSchema,
  departureTime: z.string(), // ISO string
  farePerSeat: z.number(),
  driverId: z.string(),
  ladiesOnly: z.boolean().optional(),
});

export type Ride = z.infer<typeof RideSchema>;

/**
 * Fetches the details for a specific ride.
 * @param rideId The ID of the ride.
 * @returns A promise that resolves to the ride object.
 */
export async function getRideById(rideId: string): Promise<Ride | null> {
  try {
    const response = await api.get(`/rides/${rideId}`);
    const validatedRide = RideSchema.safeParse(response.data);

    if (!validatedRide.success) {
      console.error(`Invalid data for ride ${rideId}:`, validatedRide.error);
      return null;
    }
    return validatedRide.data;
  } catch (error) {
    console.error(`Failed to fetch ride ${rideId}:`, error);
    throw new Error(`Could not fetch ride ${rideId}.`);
  }
}
