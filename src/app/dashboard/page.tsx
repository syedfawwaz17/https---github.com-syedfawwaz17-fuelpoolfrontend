"use client";

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, User, CreditCard } from 'lucide-react';
import { getUser, type UserDto } from '@/lib/auth';


const rideHistory = [
  { id: '1', from: 'San Francisco, CA', to: 'Los Angeles, CA', date: '2024-07-20', price: 45, status: 'Completed' },
  { id: '2', from: 'New York, NY', to: 'Boston, MA', date: '2024-07-22', price: 30, status: 'Completed' },
  { id: '3', from: 'Chicago, IL', to: 'Detroit, MI', date: '2024-08-05', price: 25, status: 'Upcoming' },
];

const payments = [
    { id: 'pay1', date: '2024-07-20', amount: 45, ride: 'SF to LA' },
    { id: 'pay2', date: '2024-07-22', amount: 30, ride: 'NYC to Boston' },
]

export default function DashboardPage() {
  const [user, setUser] = React.useState<UserDto | null>(null);

  React.useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-6">My Dashboard</h1>
      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="history">Ride History</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Rides</CardTitle>
              <CardDescription>A log of your past and upcoming journeys.</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {rideHistory.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell>{ride.from}</TableCell>
                      <TableCell>{ride.to}</TableCell>
                      <TableCell>{ride.date}</TableCell>
                      <TableCell>${ride.price}</TableCell>
                      <TableCell>
                        <Badge variant={ride.status === 'Completed' ? 'secondary' : 'default'}>{ride.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                    <TableHead>Ride</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.ride}</TableCell>
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
      </Tabs>
    </div>
  );
}
