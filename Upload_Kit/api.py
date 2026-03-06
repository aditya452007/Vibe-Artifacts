from fastapi import APIRouter, Depends
from shared.dependencies import get_current_user
from modules.auth.model import get_or_create_user
from modules.auth.schemas import UserProfileResponse

router = APIRouter(tags=["auth"])


@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile. Creates user document if first login."""
    user = await get_or_create_user(
        firebase_uid=current_user["firebase_uid"],
        email=current_user["email"],
    )
    return {
        "id": str(user["_id"]),
        "firebase_uid": user["firebase_uid"],
        "email": user["email"],
        "tier": user["tier"],
        "image_count": user["image_count"],
        "max_images": user["max_images"],
        "payment_status": user["payment_status"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }
