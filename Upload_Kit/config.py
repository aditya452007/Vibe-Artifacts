import os
from pathlib import Path
from dotenv import load_dotenv

# Path to the root of the project (parent of "backend" directory)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"

if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://user:pass@cluster.mongodb.net/imagetier?retryWrites=true&w=majority")
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "your-project-id")
FIREBASE_SERVICE_ACCOUNT_JSON = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "path/to/serviceAccountKey.json")
IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY", "public_xxxx")
IMAGEKIT_PRIVATE_KEY = os.getenv("IMAGEKIT_PRIVATE_KEY", "private_xxxx")
IMAGEKIT_URL_ENDPOINT = os.getenv("IMAGEKIT_URL_ENDPOINT", "https://ik.imagekit.io/your_id")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_xxxx")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "secret_xxxx")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "webhook_secret_xxxx")

APP_ENV = os.getenv("APP_ENV", "development")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
API_PREFIX = os.getenv("API_PREFIX", "/api/v1")

PREMIUM_PRICE = int(os.getenv("PREMIUM_PRICE", "9900"))
ULTRA_PRICE = int(os.getenv("ULTRA_PRICE", "49900"))
