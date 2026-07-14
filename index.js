// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  const { recipient, title, body, icon, clickUrl } = data;

  // Determine target tokens
  const usersRef = admin.database().ref('users');
  const snapshot = await usersRef.once('value');
  const users = snapshot.val() || {};

  const tokens = [];
  if (recipient === 'all') {
    for (const uid in users) {
      if (users[uid].fcmToken) {
        tokens.push(users[uid].fcmToken);
      }
    }
  } else {
    // specific user
    if (users[recipient] && users[recipient].fcmToken) {
      tokens.push(users[recipient].fcmToken);
    }
  }

  if (tokens.length === 0) {
    return { success: false, message: 'No FCM tokens found for the selected recipient(s).' };
  }

  const payload = {
    notification: {
      title: title,
      body: body,
      icon: icon || 'https://github.com/bufferzone-cloud/bufferzoneapp/logo.png',
    },
    data: {
      clickUrl: clickUrl || '',
      boldWords: '', // optional: you can pass bold words as data
    },
  };

  // Send to all tokens
  const response = await admin.messaging().sendEachForMulticast({
    tokens: tokens,
    ...payload,
  });

  return {
    success: true,
    sentCount: response.successCount,
    failedCount: response.failureCount,
  };
});
