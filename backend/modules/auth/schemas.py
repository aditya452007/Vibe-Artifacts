from pydantic import BaseModel
from datetime import datetime


class UserProfileResponse(BaseModel):
    id: str
    firebase_uid: str
    email: str
    tier: str
    image_count: int
    max_images: int
    payment_status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
