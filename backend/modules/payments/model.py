from datetime import datetime, timezone
from shared.database import get_db

TIER_MAX_IMAGES = {
    "free": 10,
    "premium": 100,
    "ultra": 1000,
}

TIER_ORDER = ["free", "premium", "ultra"]


async def get_user_tier(firebase_uid: str) -> str | None:
    db = get_db()
    user = await db.users.find_one({"firebase_uid": firebase_uid})
    if user:
        return user.get("tier", "free")
    return None


async def create_payment_record(
    user_id: str,
    razorpay_order_id: str,
    amount: int,
    currency: str,
    target_tier: str,
) -> None:
    db = get_db()
    now = datetime.now(timezone.utc)
    await db.payments.insert_one(
        {
            "user_id": user_id,
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": None,
            "amount": amount,
            "currency": currency,
            "target_tier": target_tier,
            "status": "created",
            "created_at": now,
            "paid_at": None,
        }
    )


async def update_user_tier_on_payment(razorpay_order_id: str, razorpay_payment_id: str) -> None:
    """Idempotent tier update triggered by Razorpay webhook."""
    db = get_db()
    now = datetime.now(timezone.utc)

    # Find payment record
    payment = await db.payments.find_one({"razorpay_order_id": razorpay_order_id})
    if not payment:
        return

    # Idempotency: skip if already paid
    if payment["status"] == "paid":
        return

    target_tier = payment["target_tier"]
    user_id = payment["user_id"]

    # Update payment record
    await db.payments.update_one(
        {"razorpay_order_id": razorpay_order_id},
        {
            "$set": {
                "status": "paid",
                "razorpay_payment_id": razorpay_payment_id,
                "paid_at": now,
            }
        },
    )

    # Update user tier
    await db.users.update_one(
        {"firebase_uid": user_id},
        {
            "$set": {
                "tier": target_tier,
                "max_images": TIER_MAX_IMAGES[target_tier],
                "payment_status": "paid",
                "updated_at": now,
            }
        },
    )
