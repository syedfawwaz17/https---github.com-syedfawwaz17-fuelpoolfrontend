import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, MapPin } from 'lucide-react';

export type Ride = {
  from: string;
  to: string;
  date: string;
  price: number;
  driverName: string;
  driverAvatar: string;
  image: string;
  dataAiHint?: string;
};

export function RideCard({ from, to, date, price, driverName, driverAvatar, image, dataAiHint }: Ride) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/60 backdrop-blur-xl border border-white/20">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={`Ride from ${from} to ${to}`}
            fill
            className="rounded-t-xl object-cover"
            data-ai-hint={dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold font-headline mb-2">{to}</CardTitle>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-primary" />
            <span>From: {from}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
            <span>{price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Book Ride</Button>
      </CardFooter>
    </Card>
  );
}
