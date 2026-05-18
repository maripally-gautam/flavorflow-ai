/**
 * FlavorFlow FCM Notification Server
 * 
 * Deploy this on Render as a Node.js web service.
 * 
 * Environment variables needed on Render:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_CLIENT_EMAIL  
 * - FIREBASE_PRIVATE_KEY
 * - PORT (auto-set by Render)
 * 
 * This server listens to Firestore order changes and sends push notifications
 * to users via FCM.
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { createServer } from "http";

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);
const messaging = getMessaging(app);

const statusMessages = {
  ORDERED: { title: "🛒 Order Placed!", body: "Your order has been placed successfully." },
  ACCEPTED: { title: "✅ Order Accepted!", body: "A delivery partner has accepted your order." },
  TAKEN: { title: "📦 Order Picked Up", body: "Your order has been picked up." },
  ON_THE_WAY: { title: "🚗 On the Way!", body: "Your order is on its way to you." },
  REACHED: { title: "📍 Delivery Reached", body: "The delivery partner has reached your location." },
  FINISHED: { title: "🎉 Order Delivered!", body: "Your order has been delivered. Enjoy!" },
};

// Send push notification to a user
async function sendPush(userId, title, body) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const tokens = userData?.fcmTokens || [];

    if (tokens.length === 0) {
      console.log(`No FCM tokens for user ${userId}`);
      return;
    }

    const message = {
      notification: { title, body },
      data: { type: "order", userId },
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    console.log(`Sent ${response.successCount} notifications to ${userId}`);

    // Remove invalid tokens
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === "messaging/registration-token-not-registered") {
        invalidTokens.push(tokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      const validTokens = tokens.filter((t) => !invalidTokens.includes(t));
      await db.collection("users").doc(userId).update({ fcmTokens: validTokens });
    }
  } catch (error) {
    console.error(`Failed to send push to ${userId}:`, error.message);
  }
}

// Listen to order status changes
function watchOrders() {
  const orderStatuses = {};

  db.collection("orders").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "modified") {
        const order = change.doc.data();
        const orderId = change.doc.id;
        const prevStatus = orderStatuses[orderId];
        const newStatus = order.status;

        if (prevStatus && prevStatus !== newStatus && order.customerId) {
          const msg = statusMessages[newStatus];
          if (msg) {
            await sendPush(order.customerId, msg.title, msg.body);
          }
        }

        orderStatuses[orderId] = newStatus;
      } else if (change.type === "added") {
        const order = change.doc.data();
        orderStatuses[change.doc.id] = order.status;

        // Send notification for new orders
        if (order.status === "ORDERED" && order.customerId) {
          await sendPush(order.customerId, "💰 Payment Successful!", `Payment of Rs ${order.total} completed.`);
          await sendPush(order.customerId, statusMessages.ORDERED.title, statusMessages.ORDERED.body);
        }
      }
    });
  });

  console.log("Watching orders for status changes...");
}

// Health check HTTP server
const PORT = process.env.PORT || 3001;
const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "flavorflow-fcm" }));
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("FlavorFlow FCM Server is running");
  }
});

server.listen(PORT, () => {
  console.log(`FCM server listening on port ${PORT}`);
  watchOrders();
});
