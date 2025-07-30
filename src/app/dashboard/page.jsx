
"use client";

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, User, CreditCard, Star, PlusCircle, Car, Loader2 } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { getRideHistory } from '@/lib/bookings';
import { getCarsByOwner } from '@/lib/cars';
import { getReviewsForUser } from '@/lib/reviews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


const payments = [
    { id: 'pay1', timestamp: '2024-07-20T18:00:00Z', amount: 45.00, status: 'completed', method: 'Card', bookingId: 'booking1' },
    { id: 'pay2', timestamp: '2024-07-22T19:30:00Z', amount: 30.00, status: 'completed', method: 'Card', bookingId: 'booking2' },
    { id: 'pay3', timestamp: '2024-08-01T12:00:00Z', amount: 25.00, status: 'failed', method: 'UPI', bookingId: 'booking3' },
];

function StarRating({ rating }) {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
            ))}
        </div>
    )
}

export default function DashboardPage() {
  const [user, setUser] = React.useState(null);
  const [rideHistory, setRideHistory] = React.useState([]);
  const [userCars, setUserCars] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(true);
  const [isLoadingCars, setIsLoadingCars] = React.useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const userData = getUser();
    if (userData) {
      setUser(userData);
      fetchRideHistory(userData.id);
      fetchUserReviews(userData.id);
      if (userData.userType === 'driver') {
        fetchUserCars(userData.id);
      } else {
        setIsLoadingCars(false);
      }
    } else {
        setIsLoadingHistory(false);
        setIsLoadingCars(false);
        setIsLoadingReviews(false);
    }
  }, []);

  const fetchRideHistory = async (riderId) => {
    setIsLoadingHistory(true);
    try {
        const bookings = await getRideHistory(riderId);
        setRideHistory(bookings);
    } catch (error) {
        console.error("Failed to fetch ride history", error);
    } finally {
        setIsLoadingHistory(false);
    }
  }

  const fetchUserCars = async (ownerId) => {
    setIsLoadingCars(true);
    try {
        const cars = await getCarsByOwner(ownerId);
        setUserCars(cars);
    } catch (error) {
        console.error("Failed to fetch user cars", error);
    } finally {
        setIsLoadingCars(false);
    }
  }

  const fetchUserReviews = async (userId) => {
    setIsLoadingReviews(true);
    try {
      const userReviews = await getReviewsForUser(userId);
      setReviews(userReviews);
    } catch (error) {
      console.error("Failed to fetch user reviews", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      case 'upcoming':
      case 'pending':
        return 'default';
      default:
        return 'outline';
    }
  }

  const formatDate = (dateString) => {
    if (!isClient) return null;
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatLongDate = (dateString) => {
    if (!isClient) return null;
    return new Date(dateString).toLocaleDateString('en-GB', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
  }

  const shouldShowCarsTab = user?.userType === 'driver';

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-6">My Dashboard</h1>
      <Tabs defaultValue="history">
        <TabsList className={cn("grid w-full", shouldShowCarsTab ? "grid-cols-5" : "grid-cols-4")}>
          <TabsTrigger value="history">Ride History</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          {shouldShowCarsTab && <TabsTrigger value="cars">My Cars</TabsTrigger>}
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Rides</CardTitle>
              <CardDescription>A log of your past and upcoming journeys.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    <p>Loading your ride history...</p>
                 </div>
              ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {rideHistory.length > 0 ? rideHistory.map((ride) => (
                        <TableRow key={ride.bookingId}>
                        <TableCell>{ride.pickupLocation}</TableCell>
                        <TableCell>{ride.destination}</TableCell>
                        <TableCell>{formatDate(ride.departureTime)}</TableCell>
                        <TableCell>${ride.farePaid.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(ride.status)}>{ride.status}</Badge>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                You have no ride history.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue={user?.phone} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your transaction history.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.timestamp)}</TableCell>
                      <TableCell className="font-mono text-xs">{payment.bookingId}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                         <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
             <CardFooter className="flex justify-between items-center border-t pt-4 mt-4">
                <div className="text-muted-foreground">
                    <p className="font-semibold">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                        <CreditCard size={20} />
                        <span>Visa ending in 1234</span>
                    </div>
                </div>
                <Button variant="outline">Manage Payments</Button>
             </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Feedback you've received from other users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingReviews ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    <p>Loading your reviews...</p>
                  </div>
              ) : (
                reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.reviewer.profilePhotoUrl} alt={review.reviewer.name} />
                      <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                         <p className="font-semibold">{review.reviewer.name}</p>
                         <StarRating rating={review.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatLongDate(review.timestamp)}
                      </p>
                      <p className="mt-2 text-foreground bg-slate-50 p-3 rounded-md border">{review.reviewText}</p>
                    </div>
                  </div>
                )) : (
                    <div className="text-center text-muted-foreground h-24 flex items-center justify-center">
                        <p>You have not received any reviews yet.</p>
                    </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {shouldShowCarsTab && (
          <TabsContent value="cars" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Cars</CardTitle>
                  <CardDescription>Manage your registered vehicles.</CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2" />
                  Add New Car
                </Button>
              </CardHeader>
              <CardContent>
                 {isLoadingCars ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                      <p>Loading your cars...</p>
                    </div>
                 ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Model</TableHead>
                        <TableHead>Registration No.</TableHead>
                        <TableHead>Fuel Type</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userCars.length > 0 ? userCars.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Car />
                            {car.model}
                          </TableCell>
                          <TableCell className="font-mono">{car.registrationNumber}</TableCell>
                          <TableCell className="capitalize">{car.fuelType}</TableCell>
                          <TableCell>{car.seatingCapacity} seats</TableCell>
                          <TableCell>{car.year}</TableCell>
                        </TableRow>
                      )) : (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                You have not added any cars yet.
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                 )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
