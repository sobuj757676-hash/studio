'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { exams } from '@/lib/placeholder-data';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function ExamsPage() {
    const upcomingExams = exams.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');
    const completedExams = exams.filter(e => e.status === 'Completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Examinations</CardTitle>
        <CardDescription>Participate in scheduled exams and view your results.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming & Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <ExamTable exams={upcomingExams} isCompleted={false} />
          </TabsContent>
          <TabsContent value="completed">
            <ExamTable exams={completedExams} isCompleted={true} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ExamTable({ exams, isCompleted }: { exams: typeof import('@/lib/placeholder-data').exams; isCompleted: boolean }) {
    if (exams.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No {isCompleted ? 'completed' : 'upcoming'} exams.</p>
            </div>
        )
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>{isCompleted ? 'Score' : 'Total Marks'}</TableHead>
                    <TableHead>Status / Action</TableHead>
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
                        <TableCell>
                            {isCompleted && exam.score !== undefined ? (
                                <span className="font-semibold">{`${exam.score} / ${exam.totalMarks}`}</span>
                            ) : (
                                <span>{exam.totalMarks}</span>
                            )}
                        </TableCell>
                         <TableCell>
                            {isCompleted ? (
                                <Badge variant="secondary">Completed</Badge>
                            ) : exam.status === 'Ongoing' ? (
                                <Link href={`/exam/${exam.id}`}>
                                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                        Start Exam
                                    </Button>
                                </Link>
                            ) : (
                                <Badge variant="outline">Upcoming</Badge>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
