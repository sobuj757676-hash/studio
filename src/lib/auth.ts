'use server';

import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAdminApp } from './firebase-admin';
import { cookies } from 'next/headers';
import { Student } from './placeholder-data';
import { firebaseConfig } from './firebase';

// Initialize Firebase client app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function setAdminClaim(uid: string) {
    const adminAuth = getAdminApp().auth;
    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
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
