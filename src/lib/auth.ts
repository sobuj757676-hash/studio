'use server';

import { getAuth, signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAdminApp } from './firebase-admin';
import { cookies }from 'next/headers';
import { Student } from './placeholder-data';
import { firebaseConfig } from './firebase';

// Initialize Firebase client app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export async function signInWithStudentId(studentId: string, password: string) {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where("studentId", "==", studentId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("Student not found.");
    }

    const studentDoc = querySnapshot.docs[0];
    const student = studentDoc.data() as Student;

    if (student.password !== password) {
        throw new Error("Invalid password.");
    }

    const adminAuth = getAdminApp().auth;
    const customToken = await adminAuth.createCustomToken(studentDoc.id, { role: 'student' });
    
    const userCredential = await signInWithCustomToken(auth, customToken);
    const idToken = await userCredential.user.getIdToken();

    await createSessionCookie(idToken);

    return { success: true, user: { uid: userCredential.user.uid, role: 'student' } };
}


export async function signInWithAdminEmail(email: string, password: string) {
    // For this app, we will use a simplified admin check.
    // In a production app, you would have a 'users' collection with roles.
    if (email !== 'admin@edutraq.com') {
        throw new Error("Admin user not found.");
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const adminAuth = getAdminApp().auth;

    // Set a custom claim for the admin role
    await adminAuth.setCustomUserClaims(userCredential.user.uid, { role: 'admin' });

    await createSessionCookie(idToken);

    return { success: true, user: { uid: userCredential.user.uid, role: 'admin' } };
}

export async function createSessionCookie(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const adminAuth = getAdminApp().auth;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
}

export async function verifySessionCookie(sessionCookie: string) {
    const adminAuth = getAdminApp().auth;
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        
        let userProfile: any = {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            role: decodedClaims.role,
        };

        if (decodedClaims.role === 'student') {
            const studentDoc = await getDoc(doc(db, 'students', decodedClaims.uid));
            if (studentDoc.exists()) {
                userProfile = { ...userProfile, ...studentDoc.data() };
            }
        } else if (decodedClaims.role === 'admin') {
             userProfile.name = 'Admin User';
        }
        
        return { user: userProfile };
    } catch (error) {
        console.error('Session verification failed:', error);
        return { user: null };
    }
}


export async function signOut() {
    cookies().delete('__session');
}

export async function getCurrentUser() {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session');
    if (!sessionCookie) {
      return null;
    }
    const { user } = await verifySessionCookie(sessionCookie.value);
    return user;
}
