import admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            path.resolve(process.cwd(), 'config/firebase-adminsdk.json')
        ),
    });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
