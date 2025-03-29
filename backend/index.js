const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const multer = require("multer");
const { getStorage } = require("firebase-admin/storage");
const path = require("path");

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "your-project-id.appspot.com", // 🔹 Change this to your Firebase Storage bucket name
});

const db = admin.firestore();
const bucket = getStorage().bucket();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Multer for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("Backend is running! 🚀");
});

// 📌 Handle Feedback Submission (Text + Image)
app.post("/feedback", upload.single("image"), async (req, res) => {
    try {
        const { name, feedback } = req.body;
        let imageUrl = null;

        if (!name || !feedback) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🔹 If an image is uploaded, upload it to Firebase Storage
        if (req.file) {
            const fileName = `feedback_images/${Date.now()}_${req.file.originalname}`;
            const file = bucket.file(fileName);

            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            // Get the public URL of the uploaded file
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }

        // 🔹 Store feedback + image URL in Firestore
        const feedbackRef = db.collection("feedbacks").doc();
        await feedbackRef.set({
            name,
            feedback,
            imageUrl,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Fetch All Feedback
app.get("/feedback", async (req, res) => {
    try {
        const feedbackCollection = await db.collection("feedbacks").orderBy("timestamp", "desc").get();
        const feedbacks = feedbackCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
