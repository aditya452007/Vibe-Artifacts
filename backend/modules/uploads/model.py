from datetime import datetime, timezone
from bson import ObjectId
from pymongo import ReturnDocument
from shared.database import get_db
from shared.exceptions import QuotaExceededException, ImageNotFoundException, UnauthorizedException


async def get_user_images(user_id: str) -> list[dict]:
    """Return all images for a user, sorted by uploaded_at descending."""
    db = get_db()
    cursor = db.images.find({"user_id": user_id}).sort("uploaded_at", -1)
    images = []
    async for img in cursor:
        images.append(img)
    return images


async def register_image(user_id: str, image_url: str, imagekit_file_id: str | None) -> dict:
    """Atomically check quota, increment count, and insert image metadata."""
    db = get_db()

    # Atomic quota check + increment
    user = await db.users.find_one_and_update(
        {
            "firebase_uid": user_id,
            "$expr": {"$lt": ["$image_count", "$max_images"]},
        },
        {
            "$inc": {"image_count": 1},
            "$set": {"updated_at": datetime.now(timezone.utc)},
        },
        return_document=ReturnDocument.AFTER,
    )

    if user is None:
        # Either user doesn't exist or quota exceeded — check which
        existing = await db.users.find_one({"firebase_uid": user_id})
        if existing:
            raise QuotaExceededException(
                used=existing["image_count"],
                max_images=existing["max_images"],
            )
        raise QuotaExceededException(used=0, max_images=0)

    # Insert image metadata
    now = datetime.now(timezone.utc)
    image_doc = {
        "user_id": user_id,
        "image_url": image_url,
        "imagekit_file_id": imagekit_file_id,
        "uploaded_at": now,
    }
    result = await db.images.insert_one(image_doc)
    image_doc["_id"] = result.inserted_id
    return image_doc


async def delete_image(user_id: str, image_id: str) -> None:
    """Verify ownership, delete image, and decrement quota."""
    db = get_db()

    try:
        oid = ObjectId(image_id)
    except Exception:
        raise ImageNotFoundException()

    image = await db.images.find_one({"_id": oid})
    if image is None:
        raise ImageNotFoundException()

    if image["user_id"] != user_id:
        raise UnauthorizedException("You do not own this image")

    await db.images.delete_one({"_id": oid})
    await db.users.update_one(
        {"firebase_uid": user_id},
        {
            "$inc": {"image_count": -1},
            "$set": {"updated_at": datetime.now(timezone.utc)},
        },
    )
