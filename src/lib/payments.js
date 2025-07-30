
import api from "./api";
import { z } from "zod";

export const PaymentDtoSchema = z.object({
  id: z.string().optional(),
  bookingId: z.string(),
  amount: z.number(),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  timestamp: z.string().optional(),
});



/**
 * Creates a new payment record.
 * @param {Omit<import('./payments').PaymentDto, 'id' | 'status' | 'timestamp'>} paymentData The payment data.
 * @returns {Promise<import('./payments').PaymentDto>} A promise that resolves to the created payment DTO.
 */
export async function createPayment(paymentData) {
    try {
        const response = await api.post('/payments', paymentData);
        return response.data;
    } catch (error) {
        console.error("Failed to create payment", error);
        throw new Error("Could not initiate payment.");
    }
}
