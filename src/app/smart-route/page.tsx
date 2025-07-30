import { MeetingPointFinder } from '@/components/meeting-point-finder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function SmartRoutePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Smart Route Optimization</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Let AI find the perfect meeting spot for your carpool group.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <MeetingPointFinder />
        </div>
        
        <div className="space-y-4">
            <Card className="bg-accent/30 border-accent">
                 <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <div className="bg-accent rounded-full p-2">
                        <Lightbulb className="text-accent-foreground"/>
                    </div>
                    <CardTitle>How it works</CardTitle>
                 </CardHeader>
                 <CardContent className="text-sm text-muted-foreground">
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Enter the starting locations for all carpool members.</li>
                        <li>Our AI analyzes distances, traffic, and amenities.</li>
                        <li>Get an optimal meeting point suggestion with a justification.</li>
                        <li>Save time and fuel on your next shared ride!</li>
                    </ol>
                 </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
