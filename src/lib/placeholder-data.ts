import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, serverTimestamp, where, query } from 'firebase/firestore';

export type Student = {
  id: string;
  studentId: string;
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
  password?: string;
};

export type Course = {
  id: string;
  name: string;
  duration: string;
  description?: string;
  materials: {
    id: string;
    type: 'pdf' | 'video' | 'notes';
    title: string;
    url: string;
  }[];
};

export type Transaction = {
  id:string;
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

export type RecentActivity = {
    id: string;
    description: string;
    time: string;
}

async function fetchData<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

async function fetchDoc<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
}

export const getStudents = () => fetchData<Student>('students');
export const getStudentById = (id: string) => fetchDoc<Student>('students', id);
export const getCourses = () => fetchData<Course>('courses');
export const getTransactions = () => fetchData<Transaction>('transactions');
export const getExams = () => fetchData<Exam>('exams');
export const getRecentActivities = () => fetchData<RecentActivity>('recentActivities');

export const getExamQuestions = async (examId: string): Promise<ExamQuestion[]> => {
    const questionsCollection = collection(db, `exams/${examId}/questions`);
    const querySnapshot = await getDocs(questionsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamQuestion));
};

export const addCourse = async (course: Omit<Course, 'id' | 'materials'>) => {
    try {
        await addDoc(collection(db, "courses"), {
            ...course,
            materials: [] 
        });
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const addStudent = async (studentData: Omit<Student, 'id' | 'studentId' | 'photo' | 'dues' > & {dues: number, photo: string}) => {
    try {
        // The document ID will become the user's UID in Firebase Auth
        const studentRef = doc(collection(db, "students"));
        
        // Use the first 6 chars of the doc ID for a shorter, but still unique student ID.
        const studentId = `ET${studentRef.id.substring(0, 6).toUpperCase()}`;
        const password = Math.random().toString(36).slice(-8);

        await setDoc(studentRef, {
            ...studentData,
            studentId: studentId,
            password: password, // Storing password in plaintext, NOT FOR PRODUCTION
            createdAt: serverTimestamp(),
        });
        
        // Also record the admission fee as the first transaction
        if (studentData.dues > 0) {
            await addDoc(collection(db, "transactions"), {
                studentId: studentId,
                studentName: studentData.name,
                amount: studentData.dues,
                purpose: 'Admission',
                date: studentData.joiningDate,
                createdAt: serverTimestamp(),
            });
        }

        return { studentId, password };
        
    } catch (e) {
        console.error("Error adding student: ", e);
        throw e;
    }
}
