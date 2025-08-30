'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addCourse } from '@/lib/placeholder-data';
import { Textarea } from '@/components/ui/textarea';

const courseFormSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters.'),
  duration: z.string().min(2, 'Duration must be specified.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      duration: '',
      description: '',
    },
  });

  async function onSubmit(data: CourseFormValues) {
    try {
        await addCourse(data);
        toast({
            title: "Course Added!",
            description: `Successfully added the "${data.name}" course.`,
            className: 'bg-accent text-accent-foreground'
        });
        router.push('/admin/courses');
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Could not add the course. Please try again.",
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
        <CardDescription>Fill out the form to create a new course.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced Web Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 6 Months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the course content, objectives, and target audience."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Adding Course..." : "Add Course"}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
