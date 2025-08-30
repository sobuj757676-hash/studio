
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStudents } from '@/lib/placeholder-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default async function StudentsPage() {
  const students = await getStudents();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage all enrolled students in the system.</CardDescription>
        </div>
        <Link href="/admin/students/new">
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Dues</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
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
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">{student.studentId}</Badge>
                </TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>{student.joiningDate}</TableCell>
                <TableCell>
                  {student.dues > 0 ? (
                    <Badge variant="destructive">${student.dues.toFixed(2)}</Badge>
                  ) : (
                    <Badge variant="secondary">Paid</Badge>
                  )}
                </TableCell>
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
