import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getTransactions, getStudents } from '@/lib/placeholder-data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export default async function TransactionsPage() {
    const students = await getStudents();
    const student = students[0];
    const transactions = await getTransactions();
    const studentTransactions = transactions.filter(t => t.studentId === student.id);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A detailed record of all your payments.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {student.dues > 0 && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Outstanding Dues</AlertTitle>
                <AlertDescription>
                    You have an outstanding balance of <span className="font-bold">${student.dues.toFixed(2)}</span>. Please clear it at your earliest convenience.
                </AlertDescription>
            </Alert>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                <TableCell>
                    <Badge variant="outline">{transaction.purpose}</Badge>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="text-right font-medium">${transaction.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
             {studentTransactions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No transactions found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
