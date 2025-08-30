import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award, FileText } from 'lucide-react';

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Results & Certificates</CardTitle>
          <CardDescription>View your final results and download your academic documents.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-6 border-2 border-dashed rounded-lg text-center">
                <h3 className="text-2xl font-bold text-primary">Congratulations!</h3>
                <p className="text-lg text-muted-foreground mt-2">You have successfully completed the Web Development course.</p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Final Grade</p>
                        <p className="text-5xl font-bold text-accent">A+</p>
                    </div>
                    <div className="text-center sm:border-l sm:pl-8 ml-8">
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                        <p className="text-5xl font-bold">92.5%</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <FileText className="w-10 h-10 text-primary" />
                <div>
                    <CardTitle>Digital Mark Sheet</CardTitle>
                    <CardDescription>A detailed breakdown of your scores.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Mark Sheet
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <Award className="w-10 h-10 text-primary" />
                <div>
                    <CardTitle>Provisional Testimonial</CardTitle>
                    <CardDescription>Your official course completion certificate.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Testimonial
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
