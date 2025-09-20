import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from '@/components/voting/MainNav';

export const metadata: Metadata = {
  title: 'Virtual Polling',
  description: 'Tamper-evident demo voting system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <MainNav />
        <div className="flex-grow">
          {children}
        </div>
        <footer className="p-4 text-center text-muted-foreground text-sm">
          <p>Local demo. Keep your voter/election IDs safe.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
