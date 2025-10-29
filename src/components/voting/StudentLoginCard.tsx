
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function StudentLoginCard() {
  const [collegeId, setCollegeId] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!collegeId) {
      setError('Please enter your College ID.');
      return;
    }
    setError(null);
    setIsSending(true);

    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSending(false);
    setIsOtpSent(true);
    toast({
      title: 'OTP Sent!',
      description: `An OTP has been sent to your registered contact for ID: ${collegeId}. (Hint: Use '123456' for this demo)`,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setError(null);
    setIsVerifying(true);

    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsVerifying(false);

    if (otp === '123456') {
      toast({
        title: 'Login Successful!',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/student');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <LogIn className="w-6 h-6 text-primary" />
          Enter Credentials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collegeId">College ID</Label>
            <div className="flex gap-2">
              <Input
                id="collegeId"
                name="collegeId"
                placeholder="e.g., 2024-STUD-001"
                required
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                disabled={isOtpSent || isSending}
              />
              <Button onClick={handleSendOtp} disabled={isSending || isOtpSent}>
                {isSending && <Loader2 className="animate-spin" />}
                {!isSending && <Send />}
                <span className="ml-2 hidden sm:inline">{isOtpSent ? 'OTP Sent' : 'Send OTP'}</span>
              </Button>
            </div>
          </div>
          
          {isOtpSent && (
            <div className="space-y-2 animate-in fade-in-0 duration-500">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input
                id="otp"
                name="otp"
                placeholder="Enter 6-digit OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isVerifying}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!isOtpSent || isVerifying} className="w-full">
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isVerifying ? 'Verifying...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
