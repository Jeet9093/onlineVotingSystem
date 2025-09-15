"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { closeElection } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { Archive, Camera, Loader2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

const initialState = {};

export function CloseElectionCard() {
  const [state, formAction] = useActionState(closeElection, initialState);
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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

  const handleVerify = async () => {
    if (!videoRef.current) return;
    setIsVerifying(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/jpeg');
    setPhotoDataUri(dataUri);
    // Simulate verification
    setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
        toast({
            title: "Identity Verified!",
            description: "You can now close the election."
        })
    }, 1000)
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Archive className="w-6 h-6 text-primary" />
          Close Election
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
             <div className="space-y-2">
                <Label>Admin Verification</Label>
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
                     <Button onClick={handleVerify} disabled={hasCameraPermission !== true || isVerifying || isVerified} className="w-full">
                        {isVerifying ? <Loader2 className="animate-spin mr-2" /> : isVerified ? <UserCheck className="mr-2" /> : <Camera className="mr-2" />}
                        {isVerified ? 'Verified' : isVerifying ? 'Verifying...' : 'Verify Identity'}
                    </Button>
                </div>
            </div>
            <form action={formAction}>
                <input type="hidden" name="photoDataUri" value={photoDataUri} />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="close-electionId">Election ID</Label>
                  <Input id="close-electionId" name="electionId" placeholder="Paste election UUID to close" required />
                </div>
                <FormSubmitButton variant="destructive" disabled={!isVerified}>Close Election</FormSubmitButton>
                <FormStatus state={state} />
              </div>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
