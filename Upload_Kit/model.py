from datetime import datetime, timezone
from shared.database import get_db


TIER_MAX_IMAGES = {
    "free": 10,
    "premium": 100,
    "ultra": 1000,
}


from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

async def get_or_create_user(firebase_uid: str, email: str) -> dict:
    """Get existing user or create new one with defaults atomically."""
    db = get_db()
    now = datetime.now(timezone.utc)
    
    try:
        user = await db.users.find_one_and_update(
            {"firebase_uid": firebase_uid},
            {
                "$setOnInsert": {
                    "firebase_uid": firebase_uid,
                    "email": email,
                    "tier": "free",
                    "image_count": 0,
                    "max_images": TIER_MAX_IMAGES["free"],
                    "payment_status": "unpaid",
                    "created_at": now,
                    "updated_at": now,
                }
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return user
    except DuplicateKeyError:
        return await db.users.find_one({"firebase_uid": firebase_uid})
