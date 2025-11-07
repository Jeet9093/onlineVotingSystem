"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Trash2, Camera, Loader2, UserCheck } from 'lucide-react';
import { deleteElection } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

type FormState = {
  message?: string;
  error?: string;
};

const initialState: FormState = {};

export function DeleteElectionButton({ electionId }: { electionId: string }) {
  const [state, formAction] = useActionState(deleteElection, initialState);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: 'Success',
        description: state.message,
      });
      setOpen(false);
    }
  }, [state, toast]);

  useEffect(() => {
    if (open) {
      setIsVerified(false);
      setIsVerifying(false);
      setPhotoDataUri('');

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
    } else {
        // Cleanup camera stream when dialog is closed
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
    }
    
  }, [open, toast]);

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
            description: "You can now confirm deletion."
        })
    }, 1000)
  };


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={formAction}>
          <input type="hidden" name="electionId" value={electionId} />
          <input type="hidden" name="photoDataUri" value={photoDataUri} />
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the election. Verify your identity as an admin to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-2">
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
                 <Button type="button" onClick={handleVerify} disabled={hasCameraPermission !== true || isVerifying || isVerified} className="w-full">
                    {isVerifying ? <Loader2 className="animate-spin mr-2" /> : isVerified ? <UserCheck className="mr-2" /> : <Camera className="mr-2" />}
                    {isVerified ? 'Verified' : isVerifying ? 'Verifying...' : 'Verify Identity to Delete'}
                </Button>
            </div>
          </div>
          <FormStatus state={state} />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <FormSubmitButton variant="destructive" disabled={!isVerified}>
              Delete
            </FormSubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
