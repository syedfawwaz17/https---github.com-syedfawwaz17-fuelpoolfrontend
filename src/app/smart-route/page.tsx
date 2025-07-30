import { MeetingPointFinder } from '@/components/meeting-point-finder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { FareEstimator } from '@/components/fare-estimator';

export default function SmartRoutePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Smart Tools</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Plan your trip with AI-powered tools for carpooling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <MeetingPointFinder />
          <FareEstimator />
        </div>
        
        <div className="space-y-4 md:sticky md:top-24">
            <Card className="bg-accent/30 border-accent">
                 <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <div className="bg-accent rounded-full p-2">
                        <Lightbulb className="text-accent-foreground"/>
                    </div>
                    <CardTitle>How it works</CardTitle>
                 </CardHeader>
                 <CardContent className="text-sm text-muted-foreground space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Meeting Point Finder</h3>
                      <ol className="list-decimal list-inside space-y-2">
                          <li>Enter the starting locations for all carpool members.</li>
                          <li>Our AI analyzes distances, traffic, and amenities.</li>
                          <li>Get an optimal meeting point suggestion.</li>
                      </ol>
                    </div>
                     <div>
                      <h3 className="font-semibold text-foreground mb-1">Fare Estimator</h3>
                      <ol className="list-decimal list-inside space-y-2">
                          <li>Enter your start and end locations.</li>
                          <li>Our AI predicts the total trip cost and per-person fare.</li>
                          <li>Plan your budget before you travel!</li>
                      </ol>
                    </div>
                 </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
