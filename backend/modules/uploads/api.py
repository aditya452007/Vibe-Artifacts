from fastapi import APIRouter, Depends
from modules.uploads.model import get_user_images, register_image, delete_image
from modules.uploads.schemas import (
    RegisterImageRequest,
    ImageResponse,
    UploadTokenResponse,
)
from modules.uploads.service import generate_imagekit_auth
from shared.dependencies import get_current_user

router = APIRouter(tags=["uploads"])


@router.post("/uploads/token", response_model=UploadTokenResponse)
async def get_upload_token(current_user: dict = Depends(get_current_user)):
    """Get signed ImageKit upload parameters."""
    auth = generate_imagekit_auth()
    return auth


@router.post("/uploads/register", response_model=ImageResponse, status_code=201)
async def register_uploaded_image(
    body: RegisterImageRequest,
    current_user: dict = Depends(get_current_user),
):
    """Register image metadata after uploading to ImageKit."""
    image = await register_image(
        user_id=current_user["firebase_uid"],
        image_url=body.image_url,
        imagekit_file_id=body.imagekit_file_id,
    )
    return {
        "id": str(image["_id"]),
        "image_url": image["image_url"],
        "uploaded_at": image["uploaded_at"],
    }


@router.get("/uploads", response_model=list[ImageResponse])
async def list_images(current_user: dict = Depends(get_current_user)):
    """Get paginated list of user's images."""
    images = await get_user_images(user_id=current_user["firebase_uid"])
    return [
        {
            "id": str(img["_id"]),
            "image_url": img["image_url"],
            "uploaded_at": img["uploaded_at"],
        }
        for img in images
    ]


@router.delete("/uploads/{image_id}")
async def delete_user_image(
    image_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete image from gallery and decrement quota."""
    await delete_image(user_id=current_user["firebase_uid"], image_id=image_id)
    return {"detail": "Image deleted successfully"}
