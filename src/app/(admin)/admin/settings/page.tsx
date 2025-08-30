
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export type StudentFormField = {
  id: string;
  label: string;
  required: boolean;
  enabled: boolean;
};

export const initialFields: StudentFormField[] = [
    { id: 'fullName', label: 'Full Name', required: true, enabled: true },
    { id: 'email', label: 'Email Address', required: true, enabled: true },
    { id: 'courseId', label: 'Course', required: true, enabled: true },
    { id: 'phone', label: 'Phone Number', required: false, enabled: true },
    { id: 'dob', label: 'Date of Birth', required: false, enabled: true },
    { id: 'guardianName', label: 'Guardian\'s Name', required: false, enabled: true },
    { id: 'address', label: 'Address', required: false, enabled: true },
    { id: 'admissionFee', label: 'Admission Fee', required: false, enabled: true },
];


export default function SettingsPage() {
    const { toast } = useToast();
    const [fields, setFields] = React.useState<StudentFormField[]>(initialFields);
    const [loading, setLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    const settingsDocRef = React.useMemo(() => doc(db, "settings", "studentForm"), []);

    React.useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const docSnap = await getDoc(settingsDocRef);
                if (docSnap.exists()) {
                    const savedFields = docSnap.data().fields as StudentFormField[];
                    // Merge with initial fields to handle newly added fields in code
                    const updatedFields = initialFields.map(initialField => {
                        const savedField = savedFields.find(sf => sf.id === initialField.id);
                        return savedField ? { ...initialField, ...savedField } : initialField;
                    });
                    setFields(updatedFields);
                } else {
                    // If no settings saved yet, use initialFields
                    setFields(initialFields);
                }
            } catch (error) {
                console.error("Error fetching settings: ", error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not load form settings.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [toast, settingsDocRef]);

    const handleToggle = (id: string) => {
        setFields(prevFields =>
            prevFields.map(field =>
                field.id === id ? { ...field, enabled: !field.enabled } : field
            )
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setDoc(settingsDocRef, { fields });
            toast({
                title: "Settings Saved",
                description: "Student form fields have been updated successfully.",
                className: 'bg-accent text-accent-foreground'
            });
        } catch (error) {
            console.error("Error saving settings: ", error);
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not save settings. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <SettingsLoadingSkeleton />
    }

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Manage application-wide settings and configurations.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Student Registration Form</CardTitle>
            <CardDescription>
                Enable or disable fields on the new student registration form. Required fields cannot be disabled.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-4 rounded-md border p-4">
                 {fields.map(field => (
                    <div key={field.id} className="flex items-center justify-between">
                        <Label htmlFor={field.id} className="font-medium">
                            {field.label} {field.required && <span className="text-destructive">*</span>}
                        </Label>
                        <Switch
                            id={field.id}
                            checked={field.enabled}
                            onCheckedChange={() => handleToggle(field.id)}
                            disabled={field.required || isSaving}
                        />
                    </div>
                ))}
            </div>
             <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsLoadingSkeleton() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-96" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
             <Skeleton className="h-8 w-64" />
             <Skeleton className="h-4 w-full max-w-lg" />
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-4 rounded-md border p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
