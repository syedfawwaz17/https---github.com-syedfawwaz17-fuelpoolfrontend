import api from "./api";
import { z } from "zod";
import { getUserById, type UserDto } from "./auth";

export const LocationSchema = z.object({
  address: z.string(),
  coordinates: z.array(z.number()).optional(),
});

// Zod schema for the departureTime object
export const DepartureTimeSchema = z.object({
  seconds: z.number(),
  nanos: z.number(),
});

// Function to convert the departureTime object to an ISO string
const departureTimeToIsoString = (departureTime: z.infer<typeof DepartureTimeSchema>): string => {
  return new Date(departureTime.seconds * 1000).toISOString();
};


export const RideSchema = z.object({
  id: z.string(),
  pickupLocation: LocationSchema,
  destination: LocationSchema,
  // Use a transform to convert the object to an ISO string upon parsing
  departureTime: z.preprocess((arg) => {
    if (typeof arg === 'string') {
      return arg; // Allow plain strings for flexibility
    }
    const parsed = DepartureTimeSchema.safeParse(arg);
    if (parsed.success) {
      return departureTimeToIsoString(parsed.data);
    }
    return arg;
  }, z.string()),
  farePerSeat: z.number(),
  driverId: z.string(),
  ladiesOnly: z.boolean().optional(),
  fuelType: z.string().optional().nullable(),
});

export type Ride = z.infer<typeof RideSchema>;

// A combined type for displaying ride cards with driver info
export type RideWithDriver = Ride & {
  driver: {
    name: string;
    profilePhotoUrl?: string;
  };
  image?: string;
  dataAiHint?: string;
};


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

/**
 * Fetches all open rides and enriches them with driver details.
 * @returns A promise that resolves to an array of enriched ride objects.
 */
export async function getOpenRides(): Promise<RideWithDriver[]> {
  try {
    const response = await api.get('/rides/open');
    const validatedRides = z.array(RideSchema).safeParse(response.data);

    if (!validatedRides.success) {
      console.error("Invalid open ride data structure from API:", validatedRides.error);
      return [];
    }

    // For each ride, fetch the driver's details
    const ridesWithDriverPromises = validatedRides.data.map(async (ride) => {
      try {
        const driver = await getUserById(ride.driverId);
        if (driver) {
          return {
            ...ride,
            driver: {
              name: driver.name,
              profilePhotoUrl: driver.profilePhotoUrl,
            },
          };
        }
      } catch (error) {
        console.error(`Failed to fetch driver details for ride ${ride.id}:`, error);
      }
      return null;
    });

    const enrichedRides = (await Promise.all(ridesWithDriverPromises)).filter(
      (ride): ride is RideWithDriver => ride !== null
    );

    return enrichedRides;
  } catch (error) {
    console.error('Failed to fetch open rides:', error);
    throw new Error('Could not fetch open rides.');
  }
}