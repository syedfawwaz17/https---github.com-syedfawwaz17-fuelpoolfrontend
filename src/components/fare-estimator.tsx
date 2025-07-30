"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { predictFareAction, type FareEstimatorFormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Loader2, Sparkles, CheckCircle, DollarSign } from 'lucide-react';

const initialState: FareEstimatorFormState = {
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
          Estimating Fare...
        </>
      ) : (
        <>
          <DollarSign className="mr-2 h-4 w-4" />
          Estimate Fare
        </>
      )}
    </Button>
  );
}

export function FareEstimator() {
  const [state, formAction] = useActionState(predictFareAction, initialState);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Fare Estimator</CardTitle>
        <CardDescription>Get a fare estimate for your trip based on our prediction model.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startLocation">Start Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="startLocation"
                name="startLocation"
                placeholder="Enter starting point"
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLocation">End Location</Label>
             <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="endLocation"
                name="endLocation"
                placeholder="Enter destination"
                required
                className="pl-10"
              />
            </div>
          </div>
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
            <AlertTitle className="text-primary font-headline">Fare Estimate Ready!</AlertTitle>
            <AlertDescription className="mt-2 grid grid-cols-2 gap-4">
              <div className="text-center border-r pr-4">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="font-semibold text-2xl">${state.result.predictedTotalCost.toFixed(2)}</p>
              </div>
              <div className="text-center">
                 <p className="text-sm text-muted-foreground">Fare Per Person</p>
                 <p className="font-semibold text-2xl">${state.result.farePerPerson.toFixed(2)}</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
