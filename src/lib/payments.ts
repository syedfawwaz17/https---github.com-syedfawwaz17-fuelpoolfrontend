
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

export type PaymentDto = z.infer<typeof PaymentDtoSchema>;

/**
 * Creates a new payment record.
 * @param paymentData The payment data.
 * @returns A promise that resolves to the created payment DTO.
 */
export async function createPayment(paymentData: Omit<PaymentDto, 'id' | 'status' | 'timestamp'>): Promise<PaymentDto> {
    try {
        const response = await api.post('/payments', paymentData);
        return response.data;
    } catch (error) {
        console.error("Failed to create payment", error);
        throw new Error("Could not initiate payment.");
    }
}
