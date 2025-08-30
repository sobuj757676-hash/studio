import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStudents } from '@/lib/placeholder-data';
import Image from 'next/image';

export default async function DuesPage() {
    const students = await getStudents();
    const studentsWithDues = students.filter(s => s.dues > 0);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dues Management</CardTitle>
          <CardDescription>A list of all students with outstanding dues.</CardDescription>
        </div>
        <Button size="sm" variant="outline">
            Send Reminders
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Amount Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsWithDues.length > 0 ? studentsWithDues.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Image
                      src={student.photo}
                      alt={student.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                      data-ai-hint="student photo"
                    />
                    <div>
                      <div>{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  <div>{student.email}</div>
                  <div className="text-sm text-muted-foreground">{student.phone}</div>
                </TableCell>
                <TableCell className="text-right">
                    <Badge variant="destructive" className="text-base">${student.dues.toFixed(2)}</Badge>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No outstanding dues. All payments are up to date.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
