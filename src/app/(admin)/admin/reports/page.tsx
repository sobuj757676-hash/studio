import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const reportTypes = [
  {
    title: 'Admission Reports',
    description: 'Analyze student enrollment trends by course, time period, and demographics.',
  },
  {
    title: 'Financial Reports',
    description: 'Generate detailed reports on revenue, expenses, and outstanding dues.',
  },
  {
    title: 'Performance Analysis',
    description: 'View student performance reports based on exam scores and attendance.',
  },
  {
    title: 'Attendance Reports',
    description: 'Track student attendance records for specific courses or date ranges.',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Reporting & Analytics</CardTitle>
          <CardDescription>
            Generate detailed reports for in-depth analysis of your institution's performance.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
