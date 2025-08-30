import { PlusCircle, File, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses } from '@/lib/placeholder-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const iconMap = {
    pdf: File,
    video: Video,
    notes: FileText,
}

export default function CoursesPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Upload and manage materials for each course.</CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Course
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {courses.map((course) => (
            <AccordionItem value={course.id} key={course.id}>
              <AccordionTrigger className="text-lg font-medium">{course.name}</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-muted-foreground">Duration: {course.duration}</p>
                        <Button variant="outline" size="sm" className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            Upload Material
                        </Button>
                    </div>
                    {course.materials.length > 0 ? (
                        <ul className="space-y-3">
                        {course.materials.map((material) => {
                            const Icon = iconMap[material.type];
                            return (
                            <li key={material.id} className="flex items-center justify-between p-3 bg-background rounded-md shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{material.title}</span>
                                </div>
                                <Button variant="ghost" size="sm">Download</Button>
                            </li>
                            );
                        })}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No materials uploaded for this course yet.</p>
                        </div>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
