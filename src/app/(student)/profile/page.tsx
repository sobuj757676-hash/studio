import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStudents } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';

function ProfileDetail({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value}</dd>
    </div>
  );
}

export default async function ProfilePage() {
  const students = await getStudents();
  const student = students[0]; // Placeholder for logged-in student

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Digital Profile</CardTitle>
        <CardDescription>Your complete personal and academic information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={student.photo}
              alt={student.name}
              width={160}
              height={160}
              className="rounded-full border-4 border-primary/20 shadow-lg"
              data-ai-hint="student profile"
            />
            <Button variant="outline">Change Photo</Button>
          </div>
          <div className="flex-1 w-full space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Personal Information</h3>
                <div className="space-y-4">
                    <ProfileDetail label="Full Name" value={student.name} />
                    <ProfileDetail label="Date of Birth" value={student.dob} />
                    <ProfileDetail label="Guardian's Name" value={student.guardianName} />
                </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Contact Information</h3>
                <div className="space-y-4">
                    <ProfileDetail label="Email Address" value={student.email} />
                    <ProfileDetail label="Phone Number" value={student.phone} />
                    <ProfileDetail label="Address" value={student.address} />
                </div>
            </div>

            <Separator />
            
            <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Academic Information</h3>
                <div className="space-y-4">
                    <ProfileDetail label="Student ID" value={student.id} />
                    <ProfileDetail label="Course" value={student.course} />
                    <ProfileDetail label="Joining Date" value={student.joiningDate} />
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
