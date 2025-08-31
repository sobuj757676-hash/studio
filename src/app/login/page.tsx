
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithCustomToken } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import type { Student } from '@/lib/placeholder-data';

const loginSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function StudentLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            studentId: 'ET001',
            password: 'password',
        },
    });

    const handleLogin = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            // 1. Find the student by studentId
            const studentsRef = collection(db, 'students');
            const q = query(studentsRef, where("studentId", "==", data.studentId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("Student not found.");
            }
            const studentDoc = querySnapshot.docs[0];
            const student = studentDoc.data() as Student;

            // 2. Verify password (insecure, for demo purposes)
            if (student.password !== data.password) {
                throw new Error("Invalid password.");
            }

            // 3. Get a custom token from a new API route
            const tokenResponse = await fetch('/api/auth/student-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: studentDoc.id }),
            });

            if (!tokenResponse.ok) {
                throw new Error('Could not get authentication token.');
            }

            const { token } = await tokenResponse.json();

            // 4. Sign in with the custom token on the client
            const userCredential = await signInWithCustomToken(auth, token);
            const idToken = await userCredential.user.getIdToken();

            // 5. Send the ID token to the server to create a session cookie
            const sessionResponse = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken, userType: 'student' }),
            });

            if (!sessionResponse.ok) {
                const { error } = await sessionResponse.json();
                throw new Error(error || 'Failed to create session');
            }
            
            router.push('/dashboard');
            router.refresh();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Logo className="h-10 w-10 text-primary" />
                <CardTitle className="text-3xl font-bold tracking-tight text-primary">EduTraq</CardTitle>
            </div>
            <CardDescription>Student Portal Login</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="student-id">Student ID</Label>
                      <FormControl>
                        <Input id="student-id" placeholder="e.g., ET001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex items-center justify-between">
                         <Label htmlFor="password">Password</Label>
                         <Link href="#" className="text-sm font-medium text-primary hover:underline">
                           Forgot password?
                         </Link>
                       </div>
                       <FormControl>
                         <Input id="password" type="password" {...field} />
                       </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Are you an administrator?{' '}
              <Link href="/admin/login" className="font-medium text-primary hover:underline">
                Admin Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
