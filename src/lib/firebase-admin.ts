import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let adminApp: admin.app.App;

if (!admin.apps.length) {
    if (!serviceAccount) {
        throw new Error('Firebase service account key not found in environment variables.');
    }
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
} else {
    adminApp = admin.app();
}


export const getAdminApp = () => {
    return {
        auth: admin.auth(adminApp),
        firestore: admin.firestore(adminApp),
    };
};
