import api from "./api";
import { z } from "zod";

export const BookingSchema = z.object({
  id: z.string(),
  rideId: z.string(),
  riderId: z.string(),
  status: z.string(),
  farePaid: z.number(),
  requestedAt: z.string(), // ISO 8601 string
  confirmedAt: z.string().optional().nullable(),
  cancelledAt: z.string().optional().nullable(),
  // Expanded ride details
  ride: z.object({
      id: z.string(),
      pickupLocation: z.object({
          address: z.string()
      }),
      destination: z.object({
          address: z.string()
      }),
      departureTime: z.string()
  })
});

export type Booking = z.infer<typeof BookingSchema>;

// A simplified type for the ride history display
export type RideHistoryEntry = {
    bookingId: string;
    pickupLocation: string;
    destination: string;
    departureTime: string; // ISO 8601 string
    farePaid: number;
    status: string;
}

/**
 * Fetches all bookings for a specific rider.
 * The backend is expected to join booking with ride details.
 * @param riderId The ID of the rider.
 * @returns A promise that resolves to an array of ride history entries.
 */
export async function getBookingsByRider(riderId: string): Promise<RideHistoryEntry[]> {
  try {
    // The backend endpoint should ideally return the joined data.
    // If it only returns BookingDto, you would need separate calls to get ride details.
    // Assuming the backend sends a more complete object for the frontend.
    const response = await api.get(`/bookings/user/${riderId}`);
    
    // We'll map the response to our simplified RideHistoryEntry
    const validatedData = z.array(BookingSchema).safeParse(response.data);

    if (!validatedData.success) {
        console.error("Invalid data structure from getBookingsByRider:", validatedData.error);
        return [];
    }

    return validatedData.data.map(booking => ({
        bookingId: booking.id,
        pickupLocation: booking.ride.pickupLocation.address,
        destination: booking.ride.destination.address,
        departureTime: booking.ride.departureTime,
        farePaid: booking.farePaid,
        status: booking.status,
    }));

  } catch (error) {
    console.error(`Failed to fetch bookings for rider ${riderId}:`, error);
    // Depending on requirements, you might want to re-throw the error
    // or return a default/empty value.
    throw new Error('Could not fetch ride history.');
  }
}
