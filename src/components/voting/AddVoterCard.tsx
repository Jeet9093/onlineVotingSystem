"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { addVoter } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { UserPlus, Camera, Loader2, UserCheck, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

const initialState = {};

export function AddVoterCard() {
  const [state, formAction] = useActionState(addVoter, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  
  const resetState = () => {
    setIsCaptured(false);
    setPhotoDataUri('');
    formRef.current?.reset();
    // Also reset the action state if possible, though useActionState doesn't provide a direct reset.
    // A simple way is to manage our own display state.
  };

  useEffect(() => {
    if (state.message) {
      toast({
        title: 'Voter Added!',
        description: 'Registration form has been reset.',
      });
      resetState();
    }
  }, [state.message, toast]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);
  
  const handleCapture = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/jpeg');
    setPhotoDataUri(dataUri);
    // Simulate verification
    setTimeout(() => {
        setIsCapturing(false);
        setIsCaptured(true);
        toast({
            title: "Photo Captured!",
            description: "You can now add the voter."
        })
    }, 500)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <UserPlus className="w-6 h-6 text-primary" />
                Add Voter
            </div>
            <Button variant="ghost" size="icon" onClick={resetState} className="h-8 w-8">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="sr-only">Reset</span>
            </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} ref={formRef} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Voter Name</Label>
            <Input id="name" name="name" placeholder="e.g., John Doe" required />
          </div>

          <div className="space-y-2">
            <Label>Voter Photo</Label>
            <div className="p-4 border rounded-md bg-background/30 space-y-4">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
                 <Button type="button" onClick={handleCapture} disabled={hasCameraPermission !== true || isCapturing || isCaptured} className="w-full">
                    {isCapturing ? <Loader2 className="animate-spin mr-2" /> : isCaptured ? <UserCheck className="mr-2" /> : <Camera className="mr-2" />}
                    {isCaptured ? 'Photo Captured' : isCapturing ? 'Capturing...' : 'Capture Photo'}
                </Button>
            </div>
          </div>
          
          <input type="hidden" name="photoDataUri" value={photoDataUri} />

          <FormSubmitButton disabled={!isCaptured}>Add Voter</FormSubmitButton>
          <FormStatus state={state} />
        </form>
      </CardContent>
    </Card>
  );
}