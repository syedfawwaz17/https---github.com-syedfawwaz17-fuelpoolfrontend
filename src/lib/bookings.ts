import api from "./api";
import { z } from "zod";
import { getRideById, type Ride } from "./rides";

export const BookingDtoSchema = z.object({
  id: z.string(),
  rideId: z.string(),
  riderId: z.string(),
  status: z.string(),
  farePaid: z.number(),
  requestedAt: z.string(), // ISO 8601 string
  confirmedAt: z.string().optional().nullable(),
  cancelledAt: z.string().optional().nullable(),
});

export type BookingDto = z.infer<typeof BookingDtoSchema>;

// A combined type for the ride history display
export type RideHistoryEntry = {
    bookingId: string;
    pickupLocation: string;
    destination: string;
    departureTime: string; // ISO 8601 string
    farePaid: number;
    status: string;
}

/**
 * Fetches bookings for a rider and then fetches the details for each associated ride.
 * @param riderId The ID of the rider.
 * @returns A promise that resolves to an array of enriched ride history entries.
 */
export async function getRideHistory(riderId: string): Promise<RideHistoryEntry[]> {
  try {
    // 1. Fetch all bookings for the rider
    const bookingsResponse = await api.get(`/bookings/rider/${riderId}`);
    const validatedBookings = z.array(BookingDtoSchema).safeParse(bookingsResponse.data);

    if (!validatedBookings.success) {
      console.error("Invalid booking data structure from API:", validatedBookings.error);
      return [];
    }
    
    // 2. For each booking, fetch the corresponding ride details
    const rideHistoryPromises = validatedBookings.data.map(async (booking) => {
      try {
        const ride = await getRideById(booking.rideId);
        if (ride) {
          return {
            bookingId: booking.id,
            pickupLocation: ride.pickupLocation.address,
            destination: ride.destination.address,
            departureTime: ride.departureTime,
            farePaid: booking.farePaid,
            status: booking.status,
          };
        }
      } catch (error) {
         console.error(`Failed to fetch ride details for rideId ${booking.rideId}:`, error);
      }
      return null;
    });

    // 3. Wait for all ride details to be fetched and filter out any failures
    const rideHistoryEntries = (await Promise.all(rideHistoryPromises)).filter(
      (entry): entry is RideHistoryEntry => entry !== null
    );

    return rideHistoryEntries;

  } catch (error) {
    console.error(`Failed to fetch bookings for rider ${riderId}:`, error);
    throw new Error('Could not fetch ride history.');
  }
}