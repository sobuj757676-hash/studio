'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getCourses, addStudent, Course } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { StudentFormField } from '@/app/(admin)/admin/settings/page';
import { initialFields } from '@/app/(admin)/admin/settings/page';
import { Skeleton } from '@/components/ui/skeleton';

const baseSchema = {
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.').optional().or(z.literal('')),
  dob: z.date({ required_error: 'Date of birth is required.' }).optional(),
  guardianName: z.string().min(2, 'Guardian name must be at least 2 characters.').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is too short.').optional().or(z.literal('')),
  courseId: z.string({ required_error: 'Please select a course.' }),
  admissionFee: z.coerce.number().min(0, 'Admission fee cannot be negative.').optional(),
};

type FormValues = z.infer<z.ZodObject<typeof baseSchema>>;

export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [formFields, setFormFields] = React.useState<StudentFormField[]>(initialFields);
  const [studentFormSchema, setStudentFormSchema] = React.useState(z.object(baseSchema));

  React.useEffect(() => {
    async function fetchDependencies() {
        setLoading(true);
        try {
            const settingsDocRef = doc(db, "settings", "studentForm");
            const [fetchedCourses, settingsSnap] = await Promise.all([
                getCourses(),
                getDoc(settingsDocRef)
            ]);
            
            setCourses(fetchedCourses);

            let activeFields = initialFields;
            if (settingsSnap.exists()) {
                 const savedFields = settingsSnap.data().fields as StudentFormField[];
                 activeFields = initialFields.map(initialField => {
                    const savedField = savedFields.find(sf => sf.id === initialField.id);
                    return savedField ? { ...initialField, enabled: savedField.enabled, required: savedField.required } : initialField;
                });
            }
            const enabledFields = activeFields.filter(f => f.enabled);
            setFormFields(enabledFields);

            const dynamicSchema = enabledFields.reduce((schema, field) => {
              const fieldSchema = baseSchema[field.id as keyof typeof baseSchema];
              if (field.required && fieldSchema) {
                // make it required
                if (fieldSchema instanceof z.ZodOptional) {
                     schema[field.id] = fieldSchema.unwrap();
                } else {
                    schema[field.id] = fieldSchema;
                }
              } else {
                 schema[field.id] = fieldSchema;
              }
              return schema;
            }, {} as any);
            
            setStudentFormSchema(z.object(dynamicSchema));

        } catch (error) {
            console.error("Failed to load page dependencies", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load form settings. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    }
    fetchDependencies();
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      guardianName: '',
      address: '',
      courseId: '',
      admissionFee: 500,
    }
  });
  
  React.useEffect(() => {
    form.reset(form.getValues());
  }, [studentFormSchema, form]);


  async function onSubmit(data: FormValues) {
    try {
        const courseName = courses.find(c => c.id === data.courseId)?.name || 'Unknown Course';
        const submissionData = {
            ...data,
            dob: data.dob ? format(data.dob, 'yyyy-MM-dd') : '',
            dues: data.admissionFee ? data.admissionFee : 0,
            course: courseName,
            joiningDate: format(new Date(), 'yyyy-MM-dd'),
            photo: `https://picsum.photos/seed/${data.fullName}/100/100`
        };

        await addStudent(submissionData);
        
        toast({
            title: "Student Registered!",
            description: `Successfully enrolled ${data.fullName}.`,
            className: 'bg-accent text-accent-foreground'
        });
        
        router.push('/admin/students');
    } catch (error) {
        console.error("Error registering student: ", error);
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'Could not register the student. Please try again.',
        });
    }
  }
  
  const getFieldComponent = (fieldId: string, field: any) => {
    switch (fieldId) {
        case 'fullName':
            return <Input placeholder="John Doe" {...field} />;
        case 'email':
            return <Input type="email" placeholder="student@example.com" {...field} />;
        case 'phone':
            return <Input placeholder="123-456-7890" {...field} />;
        case 'guardianName':
            return <Input placeholder="Jane Doe" {...field} />;
        case 'address':
            return <Input placeholder="123 Main St, Anytown, USA" {...field} />;
        case 'admissionFee':
            return (
                <>
                    <Input type="number" placeholder="500" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                    <FormDescription>This will be recorded as the first transaction.</FormDescription>
                </>
            );
        case 'dob':
            return (
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            );
        case 'courseId':
            return (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a course to enroll" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            );
        default:
            return null;
    }
  };

  if (loading) {
    return <NewStudentLoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Student Registration</CardTitle>
        <CardDescription>Fill out the form to enroll a new student.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {formFields.map(formField => (
                    <FormField
                      key={formField.id}
                      control={form.control}
                      name={formField.id as keyof FormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{formField.label}</FormLabel>
                          <FormControl>{getFieldComponent(formField.id, field)}</FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Registering..." : "Register Student"}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


function NewStudentLoadingSkeleton() {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
