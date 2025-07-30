import { RideCard, type Ride } from '@/components/ride-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin } from 'lucide-react';

const rides: Ride[] = [
  {
    from: 'San Francisco, CA',
    to: 'Los Angeles, CA',
    date: '2024-08-15',
    price: 45,
    driverName: 'Jane Doe',
    driverAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'city highway',
  },
  {
    from: 'New York, NY',
    to: 'Boston, MA',
    date: '2024-08-16',
    price: 30,
    driverName: 'John Smith',
    driverAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'coastal road',
  },
  {
    from: 'Chicago, IL',
    to: 'Detroit, MI',
    date: '2024-08-18',
    price: 25,
    driverName: 'Emily White',
    driverAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'urban landscape',
  },
  {
    from: 'Miami, FL',
    to: 'Orlando, FL',
    date: '2024-08-20',
    price: 20,
    driverName: 'Michael Brown',
    driverAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'sunny highway',
  },
    {
    from: 'Denver, CO',
    to: 'Salt Lake City, UT',
    date: '2024-08-22',
    price: 55,
    driverName: 'Sarah Green',
    driverAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704h',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'mountain road',
  },
  {
    from: 'Seattle, WA',
    to: 'Portland, OR',
    date: '2024-08-25',
    price: 15,
    driverName: 'David Lee',
    driverAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704i',
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
          {rides.map((ride, index) => (
            <RideCard key={index} {...ride} />
          ))}
        </div>
      </div>
    </div>
  );
}
