const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
require("dotenv").config();  // Load environment variables

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Fetch All Feedback (Sorted by Timestamp)
app.get("/feedback", async (req, res) => {
    try {
        const feedbackCollection = await db.collection("feedbacks").orderBy("timestamp", "desc").get();

        const feedbacks = feedbackCollection.docs.map(doc => {
            let data = doc.data();

            // ✅ Convert Firestore Timestamp to JavaScript Date
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null,  // Convert to readable format
            };
        });

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
