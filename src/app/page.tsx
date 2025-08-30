import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-4">
          <Logo className="h-16 w-16 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight text-primary">EduTraq</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl text-center">
          Your all-in-one solution for seamless education management. Access your portal to get started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl pt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>Access your dashboard, courses, and results.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full" variant="outline">
                  Go to Student Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Manage students, finances, and system settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/dashboard" className="w-full">
                <Button className="w-full">
                  Go to Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            First time logging in?
          </p>
          <div className="flex gap-4 mt-2">
             <Link href="/login">
                <Button variant="link">Student Login</Button>
            </Link>
            <Link href="/admin/login">
                <Button variant="link">Admin Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
