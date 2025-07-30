import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, MapPin, Shield } from 'lucide-react';
import { Badge } from './ui/badge';

type Location = {
  address: string;
  coordinates?: number[];
};

// This type is a combination of RideDto and some user details
// for display purposes. In a real app, you might fetch driver details
// separately or have the backend join them.
export type Ride = {
  id: string;
  pickupLocation: Location;
  destination: Location;
  departureTime: string; // ISO string
  farePerSeat: number;
  driver: {
    name: string;
    profilePhotoUrl?: string;
  };
  image: string; // Keep for UI, can be based on destination
  dataAiHint?: string;
  ladiesOnly?: boolean;
};

export function RideCard(ride: Ride) {
  const { pickupLocation, destination, departureTime, farePerSeat, driver, image, dataAiHint, ladiesOnly } = ride;
  const driverName = driver?.name || 'Driver';
  const driverAvatar = driver?.profilePhotoUrl || '';
  
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/60 backdrop-blur-xl border border-white/20">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={`Ride from ${pickupLocation.address} to ${destination.address}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-t-xl object-cover"
            data-ai-hint={dataAiHint}
          />
           {ladiesOnly && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-pink-100 text-pink-800 border-pink-300">
              <Shield size={14} className="mr-1" />
              Women Only
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold font-headline mb-2">{destination.address}</CardTitle>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-primary" />
            <span>From: {pickupLocation.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span>{new Date(departureTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={driverAvatar} alt={driverName} />
              <AvatarFallback>{driverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{driverName}</span>
          </div>
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <DollarSign size={20} />
            <span>{farePerSeat}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Book Ride</Button>
      </CardFooter>
    </Card>
  );
}
