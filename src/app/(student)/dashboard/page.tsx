
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, AlertCircle, Bell, BookOpen } from 'lucide-react';
import { getExams, getStudents } from '@/lib/placeholder-data';

export default async function StudentDashboard() {
  const students = await getStudents();
  const student = students[0];
  const exams = await getExams();
  const upcomingExams = exams.filter(e => e.status === 'Upcoming');

  if (!student) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not load student data. Please log in again or contact support.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {student.name.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">Here's a summary of your academic progress and activities.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Course Progress</span>
            </CardTitle>
            <CardDescription>{student.course}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={65} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">65% Complete</p>
            <Link href="/materials" className="w-full">
                <Button variant="outline" className="w-full">View Materials</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Upcoming Exams</span>
            </CardTitle>
            <CardDescription>Get ready for your upcoming assessments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.length > 0 ? upcomingExams.map(exam => (
                <div key={exam.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{exam.subject}</span>
                    <span className="text-muted-foreground">{exam.date}</span>
                </div>
            )) : <p className="text-sm text-muted-foreground text-center py-4">No upcoming exams.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span>Payment Status</span>
            </CardTitle>
            <CardDescription>Your current financial standing.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {student.dues > 0 ? (
                <>
                    <p className="text-3xl font-bold text-destructive">${student.dues.toFixed(2)}</p>
                    <Badge variant="destructive">DUE</Badge>
                     <Link href="/transactions" className="w-full block pt-2">
                        <Button className="w-full" variant="destructive">Pay Now</Button>
                    </Link>
                </>
            ) : (
                 <>
                    <p className="text-3xl font-bold text-green-600">All Clear!</p>
                    <Badge className="bg-accent text-accent-foreground">PAID UP</Badge>
                    <Link href="/transactions" className="w-full block pt-2">
                        <Button variant="secondary" className="w-full">View History</Button>
                    </Link>
                </>
            )}
          </CardContent>
        </Card>

         <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notices & Announcements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary rounded-r-md">
                <p className="font-semibold text-primary">Mid-term break</p>
                <p className="text-sm text-muted-foreground">The institution will be closed for mid-term break from August 20th to August 25th.</p>
            </div>
             <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-md">
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">Library Maintenance</p>
                <p className="text-sm text-muted-foreground">The library will be unavailable on August 18th for system upgrades.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
