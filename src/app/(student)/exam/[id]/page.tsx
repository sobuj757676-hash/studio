'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { exams, examQuestions } from '@/lib/placeholder-data';
import { Timer, FileQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const examSchema = z.object({
  answers: z.record(z.string()),
});

type ExamFormValues = z.infer<typeof examSchema>;

export default function ExamTakingPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const examId = Array.isArray(params.id) ? params.id[0] : params.id;
  const exam = exams.find((e) => e.id === examId);
  const questions = examId ? examQuestions[examId] || [] : [];

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      answers: {},
    },
  });

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exam not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: ExamFormValues) => {
    console.log('Submitted answers:', data);
    setIsSubmitting(true);
    // In a real app, you would send this data to the server for grading.
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Exam Submitted!",
            description: "Your answers have been recorded. Good luck!",
            className: 'bg-accent text-accent-foreground'
        });
        router.push('/exams');
    }, 1500);
  };
  
  const handleSubmitClick = () => {
    const answeredQuestions = Object.keys(form.getValues('answers')).filter(key => form.getValues('answers')[key]).length;
    if (answeredQuestions !== questions.length) {
        toast({
            variant: "destructive",
            title: "Incomplete Exam",
            description: "Please answer all questions before submitting."
        });
        return;
    }
    setShowConfirmDialog(true);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{exam.subject}</CardTitle>
              <CardDescription>
                Read each question carefully and select the best answer.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4" />
                <span>{questions.length} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{exam.totalMarks} Minutes</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              {questions.map((q, index) => (
                <div key={q.id}>
                  <FormField
                    control={form.control}
                    name={`answers.${q.id}`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                         <Label className="text-base font-semibold">
                            {index + 1}. {q.question}
                        </Label>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2 pt-2"
                            >
                            {q.options.map((option, i) => (
                                <FormItem key={i} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={option} />
                                </FormControl>
                                <Label className="font-normal">{option}</Label>
                                </FormItem>
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index < questions.length - 1 && <Separator className="mt-8" />}
                </div>
              ))}
               <div className="flex justify-end pt-8">
                    <Button type="button" onClick={handleSubmitClick} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                    </Button>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Confirm & Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
