
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Welcome!</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Login Successful
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You have successfully logged in. This is your student dashboard.</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
