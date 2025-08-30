import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses, students } from '@/lib/placeholder-data';
import { File, Video, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const iconMap = {
    pdf: File,
    video: Video,
    notes: FileText,
}

export default function MaterialsPage() {
    const student = students[0];
    const studentCourse = courses.find(c => c.name === student.course);

    if (!studentCourse) {
        return <p>Course not found.</p>
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Materials</CardTitle>
        <CardDescription>Access all notes, books, and tutorials for your course: <span className="font-semibold text-primary">{studentCourse.name}</span></CardDescription>
      </CardHeader>
      <CardContent>
        {studentCourse.materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCourse.materials.map(material => {
                    const Icon = iconMap[material.type];
                    return (
                        <Card key={material.id} className="flex flex-col">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <Icon className="w-10 h-10 text-primary" />
                                <div>
                                    <CardTitle className="text-lg">{material.title}</CardTitle>
                                    <CardDescription>Type: {material.type.toUpperCase()}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-end">
                                <Link href={material.url} className="w-full">
                                    <Button className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-lg text-muted-foreground">No materials available for this course yet.</p>
                <p className="text-sm text-muted-foreground">Please check back later.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
