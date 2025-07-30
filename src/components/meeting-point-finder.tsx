"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { suggestMeetingPointAction, type MeetingPointFormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Plus, Trash2, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import React from 'react';

const initialState: MeetingPointFormState = {
  status: 'idle',
  message: '',
  result: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Finding meeting point...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Find Meeting Point
        </>
      )}
    </Button>
  );
}

export function MeetingPointFinder() {
  const [state, formAction] = useActionState(suggestMeetingPointAction, initialState);
  const [locations, setLocations] = React.useState(['', '']);

  const handleAddLocation = () => {
    setLocations([...locations, '']);
  };

  const handleRemoveLocation = (index: number) => {
    if (locations.length > 2) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Meeting Point Finder</CardTitle>
        <CardDescription>Add at least two locations to find the best meeting point.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="flex items-center gap-2">
              <Label htmlFor={`location-${index}`} className="sr-only">Location {index + 1}</Label>
              <div className="relative flex-grow">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                 <Input
                    type="text"
                    id={`location-${index}`}
                    name="locations"
                    value={location}
                    onChange={(e) => handleLocationChange(index, e.target.value)}
                    placeholder={`Enter location ${index + 1}`}
                    required
                    className="pl-10"
                 />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveLocation(index)}
                disabled={locations.length <= 2}
                aria-label="Remove location"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddLocation} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Location
          </Button>
        </CardContent>
        <CardFooter className="flex-col items-start space-y-4">
          <SubmitButton />
          {state.status === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>

      {state.status === 'success' && state.result && (
        <div className="p-6 pt-0">
            <Alert className="border-primary bg-primary/5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-headline">Optimal Meeting Point Found!</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                    <p className="font-semibold text-lg">{state.result.meetingPoint}</p>
                    <p className="text-muted-foreground">{state.result.justification}</p>
                </AlertDescription>
            </Alert>
        </div>
      )}
    </Card>
  );
}
