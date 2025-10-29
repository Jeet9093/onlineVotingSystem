
import { StudentLoginCard } from '@/components/voting/StudentLoginCard';

export default function LoginPage() {
  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Student Login</h1>
        <p className="text-muted-foreground mt-2 text-lg">Enter your college ID to receive an OTP for verification.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <StudentLoginCard />
        </div>
      </main>
    </>
  );
}
