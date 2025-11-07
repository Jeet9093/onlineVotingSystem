
"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { castVote, identifyVoterAndGetName } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { Vote, Camera, Loader2, UserCheck, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

type FormState = {
  message?: string;
  error?: string;
};

const initialState: FormState = {};

export function CastVoteCard() {
  const [state, formAction] = useActionState(castVote, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  const [voterId, setVoterId] = useState<string>('');
  const [voterName, setVoterName] = useState<string>('');

  const resetState = () => {
    setIsIdentified(false);
    setVoterId('');
    setVoterName('');
    formRef.current?.reset();
  };
  
  useEffect(() => {
    // This effect runs when a vote is successfully cast
    if (state.message) {
      toast({
        title: 'Vote Cast!',
        description: 'The voting booth has been reset for the next voter.',
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

  const handleIdentify = async () => {
    if (!videoRef.current) return;
    setIsIdentifying(true);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/jpeg');

    const result = await identifyVoterAndGetName(dataUri);

    setIsIdentifying(false);

    if (result.error || !result.voterId || !result.voterName) {
      toast({
        variant: 'destructive',
        title: 'Identification Failed',
        description: result.error || 'Could not identify the voter.',
      });
      setIsIdentified(false);
    } else {
      setVoterId(result.voterId);
      setVoterName(result.voterName);
      setIsIdentified(true);
      toast({
          title: "Identity Verified!",
          description: `Welcome, ${result.voterName}! You can now cast your vote.`
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Vote className="w-6 h-6 text-primary" />
                Cast Vote
            </div>
            <Button variant="ghost" size="icon" onClick={resetState} className="h-8 w-8">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="sr-only">Reset</span>
            </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Voter Identification</Label>
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
              <Button onClick={handleIdentify} disabled={hasCameraPermission !== true || isIdentifying || isIdentified} className="w-full">
                {isIdentifying ? <Loader2 className="animate-spin mr-2" /> : isIdentified ? <UserCheck className="mr-2" /> : <Camera className="mr-2" />}
                {isIdentified ? `Identified as ${voterName}` : isIdentifying ? 'Identifying...' : 'Identify Me'}
              </Button>
            </div>
          </div>
          
          <form action={formAction} ref={formRef}>
            <input type="hidden" name="voterId" value={voterId} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="electionId">Election ID</Label>
                <Input id="electionId" name="electionId" placeholder="Paste election UUID here" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidateId">Candidate ID</Label>
                <Input id="candidateId" name="candidateId" placeholder="Paste candidate UUID here" required />
              </div>
              <FormSubmitButton disabled={!isIdentified}>Cast Vote</FormSubmitButton>
              <FormStatus state={state} />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
