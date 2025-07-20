/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// 📄 functions/index.js
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const axios = require("axios");

// Initialize Firebase Admin SDK
initializeApp();

exports.sendDailyGreeting = onSchedule(
  {
    schedule: "every day 08:00",
    timeZone: "Etc/UTC",
  },
  async (event) => {
    const greeting = getRandomGreeting();

    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: "cac1d3e5-aea5-476a-a35d-f3ab9a167f80",
          included_segments: ["All"],
          contents: { en: greeting },
        },
        {
          headers: {
            Authorization: "Basic os_v2_app_zla5hznouvdwvi256ovzuft7qcilvg7rdwauidue3265qicp4blnzrstqlbopxbsgdvtl4xfskufhrpzfh2n6yntkvrvocqk3ojjrhq",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Greeting sent:", greeting);
    } catch (err) {
      console.error("❌ Failed to send notification:", err);
    }
  }
);

// Helper function
function getRandomGreeting() {
  const greetings = [
    "Good morning! 🌞",
    "Have a wonderful day! 🌈",
    "Stay motivated and smile! 😊",
    "You're amazing – keep going! 🚀",
    "New day, new chance to shine! ✨",
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}
