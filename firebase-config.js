const admin = require('firebase-admin');

// ✅ Use double backslashes OR forward slashes
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
