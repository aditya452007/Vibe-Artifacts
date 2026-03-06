from motor.motor_asyncio import AsyncIOMotorClient
from shared.config import MONGODB_URI

client: AsyncIOMotorClient | None = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.imagetier
    # Ensure indexes
    await db.users.create_index("firebase_uid", unique=True)
    await db.users.create_index("tier")
    await db.images.create_index("user_id")
    await db.images.create_index([("user_id", 1), ("uploaded_at", -1)])
    await db.payments.create_index("user_id")
    await db.payments.create_index("razorpay_order_id", unique=True)
    print("✅ Connected to MongoDB Atlas")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_db():
    return db
