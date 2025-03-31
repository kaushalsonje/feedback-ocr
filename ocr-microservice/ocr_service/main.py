from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import io
import cloudinary
import cloudinary.uploader
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
from datetime import datetime, timezone  # ✅ Import timezone

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up Tesseract OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\lenovo\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

# ✅ Initialize Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# ✅ Initialize Firebase Firestore
cred = credentials.Certificate("serviceAccountKey.json")  # 🔹 Ensure this file exists
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ OCR + Image Upload + Firestore Storage
@app.post("/ocr/")
async def extract_text(file: UploadFile = File(...), feedback: str = Form(...)):
    try:
        # Read image file
        image_bytes = await file.read()

        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(io.BytesIO(image_bytes), folder="feedback_images")
        image_url = upload_result["secure_url"]
        print(f"✅ Image uploaded: {image_url}")

        # Open image
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("L")  # Convert to grayscale

        # Perform OCR
        extracted_text = pytesseract.image_to_string(image).strip()
        print(f"✅ Extracted Text: {extracted_text}")

        if not extracted_text:
            extracted_text = "No readable text found."

        # ✅ Store in Firebase Firestore with Timezone-Aware Timestamp
        timestamp = datetime.now(timezone.utc)  # ✅ Use timezone-aware datetime
        doc_ref = db.collection("feedbacks").add({
            "feedback": feedback,
            "image_url": image_url,
            "extracted_text": extracted_text.replace("\n", "<br>"),  # Convert new lines to HTML line breaks
            "timestamp": timestamp.isoformat()  # ✅ Store timestamp in ISO format
        })
        print("✅ Data stored in Firestore.")

        return {
            "filename": file.filename,
            "image_url": image_url,
           "extracted_text": extracted_text.replace("\n", "<br>"),  # Convert new lines to HTML line breaks
            "feedback": feedback,
            "timestamp": timestamp.isoformat()  # ✅ Return timestamp
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {"error": f"Error processing OCR: {str(e)}"}

# ✅ Fetch All Feedback
@app.get("/feedback/")
async def get_feedback():
    try:
        feedbacks_ref = db.collection("feedbacks").order_by("timestamp", direction=firestore.Query.DESCENDING).stream()

        feedbacks = []
        for doc in feedbacks_ref:
            data = doc.to_dict()
            data["id"] = doc.id  # Include Firestore doc ID
            data["timestamp"] = data["timestamp"] if isinstance(data["timestamp"], str) else data["timestamp"].isoformat()
            feedbacks.append(data)

        return feedbacks

    except Exception as e:
        print(f"❌ Error fetching feedbacks: {str(e)}")
        return {"error": f"Error fetching feedbacks: {str(e)}"}

# ✅ Delete Feedback by ID
@app.delete("/feedback/{feedback_id}")
async def delete_feedback(feedback_id: str):
    try:
        # Delete the feedback from Firestore by ID
        doc_ref = db.collection("feedbacks").document(feedback_id)
        doc_ref.delete()

        return {"message": "Feedback deleted successfully"}

    except Exception as e:
        print(f"❌ Error deleting feedback: {str(e)}")
        return {"error": f"Error deleting feedback: {str(e)}"}
