const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// POST Route for Feedback
app.post("/feedback", (req, res) => {
    const { name, feedback } = req.body;
    
    if (!name || !feedback) {
        return res.status(400).json({ error: "Name and feedback are required" });
    }

    console.log("Received Feedback:", { name, feedback });

    // You can save this feedback to Firebase Firestore here.

    res.json({ message: "Feedback received successfully!" });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
