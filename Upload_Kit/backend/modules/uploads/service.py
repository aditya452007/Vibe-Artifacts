import time
import hashlib
import hmac
from imagekitio import ImageKit
from shared.config import IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT


def get_imagekit_client() -> ImageKit:
    return ImageKit(
        public_key=IMAGEKIT_PUBLIC_KEY,
        private_key=IMAGEKIT_PRIVATE_KEY,
        url_endpoint=IMAGEKIT_URL_ENDPOINT,
    )


def generate_imagekit_auth() -> dict:
    """Generate signed upload parameters for direct client-side upload."""
    token = hashlib.md5(str(time.time()).encode()).hexdigest()
    expire = int(time.time()) + 3600  # 1 hour expiry

    signature = hmac.new(
        IMAGEKIT_PRIVATE_KEY.encode(),
        f"{token}{expire}".encode(),
        hashlib.sha1,
    ).hexdigest()

    return {
        "token": token,
        "expire": expire,
        "signature": signature,
        "public_key": IMAGEKIT_PUBLIC_KEY,
    }
