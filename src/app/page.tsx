import { RideCard, type Ride } from '@/components/ride-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin } from 'lucide-react';

const rides: Ride[] = [
  {
    id: '1',
    pickupLocation: { address: 'San Francisco, CA', coordinates: [-122.4194, 37.7749] },
    destination: { address: 'Los Angeles, CA', coordinates: [-118.2437, 34.0522] },
    departureTime: '2024-08-15T09:00:00Z',
    farePerSeat: 45,
    driver: {
        name: 'Jane Doe',
        profilePhotoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'city highway',
    ladiesOnly: true,
  },
  {
    id: '2',
    pickupLocation: { address: 'New York, NY', coordinates: [-74.006, 40.7128] },
    destination: { address: 'Boston, MA', coordinates: [-71.0589, 42.3601] },
    departureTime: '2024-08-16T10:00:00Z',
    farePerSeat: 30,
    driver: {
        name: 'John Smith',
        profilePhotoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'coastal road',
  },
  {
    id: '3',
    pickupLocation: { address: 'Chicago, IL', coordinates: [-87.6298, 41.8781] },
    destination: { address: 'Detroit, MI', coordinates: [-83.0458, 42.3314] },
    departureTime: '2024-08-18T14:00:00Z',
    farePerSeat: 25,
    driver: {
        name: 'Emily White',
        profilePhotoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'urban landscape',
    ladiesOnly: true,
  },
  {
    id: '4',
    pickupLocation: { address: 'Miami, FL', coordinates: [-80.1918, 25.7617] },
    destination: { address: 'Orlando, FL', coordinates: [-81.3792, 28.5383] },
    departureTime: '2024-08-20T11:30:00Z',
    farePerSeat: 20,
    driver: {
        name: 'Michael Brown',
        profilePhotoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
    },
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'sunny highway',
  },
    {
    id: '5',
    pickupLocation: { address: 'Denver, CO', coordinates: [-104.9903, 39.7392] },
    destination: { address: 'Salt Lake City, UT', coordinates: [-111.8910, 40.7608] },
    departureTime: '2024-08-22T08:00:00Z',
    farePerSeat: 55,
    driver: {
        name: 'Sarah Green',
        profilePhotoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704h',
    },
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'mountain road',
  },
  {
    id: '6',
    pickupLocation: { address: 'Seattle, WA', coordinates: [-122.3321, 47.6062] },
    destination: { address: 'Portland, OR', coordinates: [-122.6765, 45.5231] },
    departureTime: '2024-08-25T13:00:00Z',
    farePerSeat: 15,
    driver: {
        name: 'David Lee',
        profilePhotoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704i',
    },
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'forest drive',
  },
];

export default function Home() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <RideCard key={ride.id} {...ride} />
          ))}
        </div>
      </div>
    </div>
  );
}
