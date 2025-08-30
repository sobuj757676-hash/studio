import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { recentActivities, students } from '@/lib/placeholder-data';
import { Users, BookOpenCheck, Wallet, CircleDollarSign, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
    const totalStudents = students.length;
    const totalRevenue = 25000;
    const outstandingBills = 2;
    const attendance = 92.5;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Students" 
            value={totalStudents.toString()} 
            icon={Users} 
            description="+5 since last month" 
        />
        <StatCard 
            title="Attendance" 
            value={`${attendance}%`}
            icon={BookOpenCheck} 
            description="Average across all classes" 
        />
        <StatCard 
            title="Total Revenue" 
            value={`$${(totalRevenue / 1000).toFixed(1)}k`} 
            icon={CircleDollarSign} 
            description="+15% since last month" 
        />
        <StatCard 
            title="Outstanding Bills" 
            value={outstandingBills.toString()} 
            icon={Wallet} 
            description="Totaling $75.00" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Students with Dues</CardTitle>
            <CardDescription>
              A list of students with outstanding payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Amount Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.filter(s => s.dues > 0).map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant="destructive">${student.dues.toFixed(2)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Recent Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex h-1 w-1 mt-2.5 shrink-0 translate-y-px items-center justify-center rounded-full bg-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
