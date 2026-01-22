const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Make sure to set FIREBASE_SERVICE_ACCOUNT in .env file
let serviceAccount;

try {
  // Try to parse the service account from environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Alternative: Use individual environment variables
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };
  }

  if (!admin.apps.length) {
    const hasCertConfig =
      serviceAccount &&
      serviceAccount.project_id &&
      serviceAccount.client_email &&
      serviceAccount.private_key;

    if (hasCertConfig) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully (service account)');
    } else {
      // Fallbacks (dev friendly):
      // 1) applicationDefault() if GOOGLE_APPLICATION_CREDENTIALS is set
      // 2) initializeApp with projectId only (some operations may still fail without credentials)
      const projectId =
        process.env.FIREBASE_PROJECT_ID ||
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT;

      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          ...(projectId ? { projectId } : {})
        });
        console.log('✅ Firebase Admin initialized successfully (application default credentials)');
      } catch (adcError) {
        admin.initializeApp({
          ...(projectId ? { projectId } : {})
        });
        console.warn(
          '⚠️  Firebase Admin initialized without credentials. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS for full functionality.'
        );
      }
    }
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  console.error('⚠️  Make sure FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS is set');
}

module.exports = admin;
