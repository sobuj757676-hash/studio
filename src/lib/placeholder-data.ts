export type Student = {
  id: string;
  name: string;
  email: string;
  photo: string;
  course: string;
  joiningDate: string;
  dues: number;
  dob: string;
  guardianName: string;
  phone: string;
  address: string;
};

export type Course = {
  id: string;
  name: string;
  duration: string;
  materials: {
    id: string;
    type: 'pdf' | 'video' | 'notes';
    title: string;
    url: string;
  }[];
};

export type Transaction = {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  purpose: 'Admission' | 'Monthly Fee' | 'Exam Fee' | 'Hostel' | 'Other';
  date: string;
};

export type Exam = {
    id: string;
    subject: string;
    type: 'MCQ' | 'Practical';
    date: string;
    status: 'Upcoming' | 'Completed' | 'Ongoing';
    score?: number;
    totalMarks: number;
}

export type ExamQuestion = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export const students: Student[] = [
  { id: 'ET001', name: 'Alice Johnson', email: 'alice@example.com', photo: 'https://picsum.photos/100/100?random=1', course: 'Web Development', joiningDate: '2023-01-15', dues: 0, dob: '2002-05-20', guardianName: 'John Johnson', phone: '123-456-7890', address: '123 Web St, Codetown' },
  { id: 'ET002', name: 'Bob Williams', email: 'bob@example.com', photo: 'https://picsum.photos/100/100?random=2', course: 'Data Science', joiningDate: '2023-02-01', dues: 50, dob: '2001-08-12', guardianName: 'Barbara Williams', phone: '123-456-7891', address: '456 Data Dr, Analystville' },
  { id: 'ET003', name: 'Charlie Brown', email: 'charlie@example.com', photo: 'https://picsum.photos/100/100?random=3', course: 'UI/UX Design', joiningDate: '2023-03-10', dues: 0, dob: '2003-01-30', guardianName: 'Charles Brown Sr.', phone: '123-456-7892', address: '789 Design Ave, Creaticity' },
  { id: 'ET004', name: 'Diana Prince', email: 'diana@example.com', photo: 'https://picsum.photos/100/100?random=4', course: 'Web Development', joiningDate: '2023-04-20', dues: 25, dob: '2002-11-05', guardianName: 'Hippolyta', phone: '123-456-7893', address: '1 Paradise Island, Themyscira' },
  { id: 'ET005', name: 'Ethan Hunt', email: 'ethan@example.com', photo: 'https://picsum.photos/100/100?random=5', course: 'Cyber Security', joiningDate: '2023-05-01', dues: 0, dob: '2000-07-18', guardianName: 'Unknown', phone: '123-456-7894', address: 'IMF Headquarters, Langley' },
];

export const courses: Course[] = [
    {
        id: 'C001', name: 'Web Development', duration: '6 Months', materials: [
            { id: 'M01', type: 'pdf', title: 'HTML & CSS Basics', url: '#' },
            { id: 'M02', type: 'video', title: 'JavaScript Fundamentals', url: '#' },
            { id: 'M03', type: 'notes', title: 'React Introduction Notes', url: '#' },
        ]
    },
    {
        id: 'C002', name: 'Data Science', duration: '8 Months', materials: [
            { id: 'M04', type: 'pdf', title: 'Python for Data Science', url: '#' },
            { id: 'M05', type: 'video', title: 'Machine Learning Concepts', url: '#' },
        ]
    },
    {
        id: 'C003', name: 'UI/UX Design', duration: '4 Months', materials: [
            { id: 'M06', type: 'pdf', title: 'Design Principles', url: '#' },
            { id: 'M07', type: 'notes', title: 'Figma Mastery', url: '#' },
        ]
    },
    { id: 'C004', name: 'Cyber Security', duration: '9 Months', materials: [] },
];

export const transactions: Transaction[] = [
    { id: 'T001', studentId: 'ET001', studentName: 'Alice Johnson', amount: 500, purpose: 'Admission', date: '2023-01-15' },
    { id: 'T002', studentId: 'ET002', studentName: 'Bob Williams', amount: 500, purpose: 'Admission', date: '2023-02-01' },
    { id: 'T003', studentId: 'ET002', studentName: 'Bob Williams', amount: 100, purpose: 'Monthly Fee', date: '2023-03-01' },
    { id: 'T004', studentId: 'ET003', studentName: 'Charlie Brown', amount: 400, purpose: 'Admission', date: '2023-03-10' },
    { id: 'T005', studentId: 'ET004', studentName: 'Diana Prince', amount: 500, purpose: 'Admission', date: '2023-04-20' },
    { id: 'T006', studentId: 'ET001', studentName: 'Alice Johnson', amount: 150, purpose: 'Monthly Fee', date: '2023-02-15' },
];

export const exams: Exam[] = [
    { id: 'E01', subject: 'JavaScript Basics', type: 'MCQ', date: '2024-08-15', status: 'Ongoing', totalMarks: 10 },
    { id: 'E02', subject: 'CSS Layouts', type: 'Practical', date: '2024-07-20', status: 'Completed', score: 85, totalMarks: 100 },
    { id: 'E03', subject: 'Python Data Structures', type: 'MCQ', date: '2024-07-10', status: 'Completed', score: 92, totalMarks: 100 },
    { id: 'E04', subject: 'Figma Prototyping', type: 'Practical', date: '2024-09-01', status: 'Upcoming', totalMarks: 100 },
];

export const examQuestions: Record<string, ExamQuestion[]> = {
    'E01': [
        { id: 'Q1', question: 'What is the correct way to declare a variable in JavaScript?', options: ['var myVar;', 'variable myVar;', 'v myVar;'], correctAnswer: 'var myVar;' },
        { id: 'Q2', question: 'Which company developed JavaScript?', options: ['Microsoft', 'Netscape', 'Google'], correctAnswer: 'Netscape' },
        { id: 'Q3', question: 'What does "DOM" stand for?', options: ['Document Object Model', 'Data Object Model', 'Desktop Object Management'], correctAnswer: 'Document Object Model' },
        { id: 'Q4', question: 'Which of the following is NOT a JavaScript framework?', options: ['React', 'Angular', 'Laravel'], correctAnswer: 'Laravel' },
        { id: 'Q5', question: 'How do you write a single line comment in JavaScript?', options: ['// This is a comment', '<!-- This is a comment -->', '/* This is a comment */'], correctAnswer: '// This is a comment' },
    ],
};


export const recentActivities = [
    { id: 1, description: 'New student "Diana Prince" was registered.', time: '2 hours ago' },
    { id: 2, description: 'Payment of $100 received from "Bob Williams".', time: '5 hours ago' },
    { id: 3, description: 'New course material "React Introduction" uploaded.', time: '1 day ago' },
    { id: 4, description: 'Exam "JavaScript Basics" scheduled for 2024-08-15.', time: '2 days ago' },
];
