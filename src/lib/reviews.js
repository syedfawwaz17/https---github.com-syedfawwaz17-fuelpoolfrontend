
import api from "./api";
import { z } from "zod";
import { getMe } from "./auth"; // Assuming getMe can fetch user by ID

// This represents the structure of the reviewer, which is a simplified UserDto
const ReviewerSchema = z.object({
  name: z.string(),
  profilePhotoUrl: z.string().optional().nullable(),
});

// This represents the structure of a single review from the backend
export const ReviewSchema = z.object({
  id: z.string(),
  reviewer: ReviewerSchema, // Nested reviewer object
  revieweeId: z.string(),
  rideId: z.string().optional().nullable(),
  rating: z.number().min(1).max(5),
  reviewText: z.string(),
  timestamp: z.string(), // ISO 8601 string
});



// Since the backend returns a list of reviews with reviewerId,
// we might need a frontend transformation function if the backend doesn't populate the reviewer details.
// However, based on the `ReviewService`, it seems the `ReviewMapper` might handle this.
// For now, let's assume the API returns a structure that can be parsed into the Review schema above.
// The DTO from backend might be slightly different, let's create a DTO schema.

const ReviewDtoSchema = z.object({
    id: z.string(),
    reviewerId: z.string(),
    revieweeId: z.string(),
    rideId: z.string().optional().nullable(),
    rating: z.number(),
    reviewText: z.string(),
    timestamp: z.string(),
    // The backend DTO likely doesn't have the full reviewer object.
    // We'll fetch it separately.
});

// Mock user fetcher. In a real app, this would be an API call.
// For now, we'll create a simple user map.
const userCache = new Map();

async function getUserById(userId) {
    if (userCache.has(userId)) {
        return userCache.get(userId);
    }
    try {
        // In a real app, you would have an endpoint like /api/users/{id}
        // For now, we'll just mock this and return a placeholder user.
        // This part needs a real backend endpoint to be fully functional.
        
        // Let's create a placeholder to avoid breaking the app.
        // A real implementation would be: const response = await api.get(`/users/${userId}`);
        const mockUser = {
            id: userId,
            name: "An anonymous user",
            email: "anonymous@example.com",
            profilePhotoUrl: `https://i.pravatar.cc/150?u=${userId}`
        }
        userCache.set(userId, mockUser);
        return mockUser;

    } catch (error) {
        console.error(`Failed to fetch user ${userId}`, error);
        return null;
    }
}


/**
 * Fetches reviews for a specific user from the backend API.
 * @param {string} userId The ID of the user (the reviewee).
 * @returns {Promise<import('./reviews').Review[]>} A promise that resolves to an array of Review objects.
 */
export async function getReviewsForUser(userId) {
  try {
    const response = await api.get(`/reviews/reviewee/${userId}`);
    const validatedDtos = z.array(ReviewDtoSchema).safeParse(response.data);

    if (!validatedDtos.success) {
      console.error("Invalid review data structure from API:", validatedDtos.error);
      return [];
    }

    // For each review, fetch the reviewer's details
    const reviewsWithReviewerData = await Promise.all(
        validatedDtos.data.map(async (dto) => {
            const reviewer = await getUserById(dto.reviewerId);
            if (reviewer) {
                return {
                    id: dto.id,
                    reviewer: {
                        name: reviewer.name,
                        profilePhotoUrl: reviewer.profilePhotoUrl,
                    },
                    revieweeId: dto.revieweeId,
                    rideId: dto.rideId,
                    rating: dto.rating,
                    reviewText: dto.reviewText,
                    timestamp: dto.timestamp,
                };
            }
            return null;
        })
    );


    return reviewsWithReviewerData.filter((review) => review !== null);

  } catch (error) {
    console.error(`Failed to fetch reviews for user ${userId}:`, error);
    throw new Error('Could not fetch user reviews.');
  }
}
