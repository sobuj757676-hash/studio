import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { exams } from '@/lib/placeholder-data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ExamsPage() {
  const upcomingExams = exams.filter(e => e.status === 'Upcoming');
  const completedExams = exams.filter(e => e.status === 'Completed');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Exam Setup</CardTitle>
            <CardDescription>Create new MCQ question banks and practical exam evaluations.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              New Question Bank
            </Button>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Schedule New Exam
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Here you can create subject-specific MCQ question banks and set up exams with specific parameters and schedules. For practical exams, create an evaluation schema for instructors to use.
            </p>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Scheduled Exams</CardTitle>
              <CardDescription>View and manage all upcoming and completed exams.</CardDescription>
          </CardHeader>
          <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <ExamTable exams={upcomingExams} />
            </TabsContent>
            <TabsContent value="completed">
                <ExamTable exams={completedExams} />
            </TabsContent>
            </Tabs>
          </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Practical Exam Evaluation</CardTitle>
          <CardDescription>Input marks for students based on their practical exam performance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">Select a student and practical exam to input their score. The scores will be instantly updated in the student's profile.</p>
            <Button>Evaluate Practical Exam</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ExamTable({ exams }: { exams: typeof import('@/lib/placeholder-data').exams }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {exams.map(exam => (
                    <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.subject}</TableCell>
                        <TableCell>
                            <Badge variant={exam.type === 'MCQ' ? 'default' : 'secondary'}>{exam.type}</Badge>
                        </TableCell>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Cancel Exam</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
