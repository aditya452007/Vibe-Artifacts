import hmac
import hashlib
import razorpay
from shared.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PREMIUM_PRICE, ULTRA_PRICE
from shared.exceptions import InvalidSignatureException

TIER_PRICES = {
    "premium": PREMIUM_PRICE,
    "ultra": ULTRA_PRICE,
}

TIER_ORDER = ["free", "premium", "ultra"]


def get_razorpay_client() -> razorpay.Client:
    return razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


def create_razorpay_order(target_tier: str) -> dict:
    """Create a Razorpay order for the given tier."""
    client = get_razorpay_client()
    amount = TIER_PRICES[target_tier]
    order = client.order.create(
        {
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,
        }
    )
    return {
        "order_id": order["id"],
        "amount": amount,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
    }


def verify_webhook_signature(body: bytes, signature: str, secret: str) -> bool:
    """Verify HMAC-SHA256 webhook signature from Razorpay."""
    computed = hmac.new(
        secret.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(computed, signature)
