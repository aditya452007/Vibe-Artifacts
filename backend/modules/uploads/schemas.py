from pydantic import BaseModel, field_validator
from datetime import datetime
import re


class RegisterImageRequest(BaseModel):
    image_url: str
    imagekit_file_id: str | None = None

    @field_validator("image_url")
    @classmethod
    def validate_image_url(cls, v: str) -> str:
        if not re.match(r"^https?://", v):
            raise ValueError("Invalid image URL format")
        return v

    model_config = {"extra": "forbid"}


class ImageResponse(BaseModel):
    id: str
    image_url: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class UploadTokenResponse(BaseModel):
    token: str
    expire: int
    signature: str
    public_key: str
