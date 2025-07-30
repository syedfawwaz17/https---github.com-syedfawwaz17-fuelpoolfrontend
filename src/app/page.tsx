"use client";

import * as React from 'react';
import { RideCard, type RideWithDriver } from '@/components/ride-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { getOpenRides } from '@/lib/rides';

export default function Home() {
  const [rides, setRides] = React.useState<RideWithDriver[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRides = async () => {
      try {
        const openRides = await getOpenRides();
        // Add placeholder images and hints for the demo
        const ridesWithImages = openRides.map((ride, index) => {
          const hints = ['city highway', 'coastal road', 'urban landscape', 'sunny highway', 'mountain road', 'forest drive'];
          return {
            ...ride,
            image: 'https://placehold.co/600x400.png',
            dataAiHint: hints[index % hints.length],
          };
        });
        setRides(ridesWithImages);
      } catch (error) {
        console.error("Failed to fetch open rides", error);
        // Handle error appropriately in a real app (e.g., show a toast)
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center bg-card rounded-xl shadow-md border">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">Find Your Next Ride</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Join thousands of users in sharing rides and saving money.
        </p>
        <Card className="mt-6 w-full max-w-4xl bg-background/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <form className="grid md:grid-cols-4 gap-4 items-center">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input type="text" placeholder="Leaving from..." className="pl-10" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input type="text" placeholder="Going to..." className="pl-10" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input type="date" placeholder="Date" className="pl-10" />
              </div>
              <Button type="submit" className="w-full">
                Search Rides
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 md:px-0">
        <h2 className="text-3xl font-bold mb-6 font-headline">Available Rides</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Finding available rides...</p>
          </div>
        ) : (
          rides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map((ride) => (
                <RideCard key={ride.id} {...ride} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
                <p>No open rides available at the moment. Please check back later!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
