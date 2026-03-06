from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from shared.config import FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_PROJECT_ID
import os

_firebase_initialized = False
security = HTTPBearer()


def _init_firebase():
    global _firebase_initialized
    if not _firebase_initialized:
        print(f"Initializing Firebase. FIREBASE_SERVICE_ACCOUNT_JSON is: {FIREBASE_SERVICE_ACCOUNT_JSON}")
        service_account_path = FIREBASE_SERVICE_ACCOUNT_JSON
        if not os.path.isfile(service_account_path):
            from pathlib import Path
            BASE_DIR = Path(__file__).resolve().parent.parent.parent
            alt_path = BASE_DIR / service_account_path
            print(f"Path not found directly. Trying alt_path: {alt_path}")
            if os.path.isfile(alt_path):
                service_account_path = str(alt_path)

        print(f"Final resolved service_account_path is: {service_account_path}")
        print(f"File exists at resolved path? {os.path.isfile(service_account_path)}")

        if os.path.isfile(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("Successfully initialized Firebase Admin with Service Account JSON.")
        else:
            print("WARNING: Service account file not found. Falling back to default credentials.")
            firebase_admin.initialize_app(options={'projectId': FIREBASE_PROJECT_ID})
        _firebase_initialized = True

def init_firebase():
    """Call this at startup."""
    _init_firebase()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Extract and verify Firebase ID token. Returns dict with firebase_uid and email."""
    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
        return {
            "firebase_uid": decoded["uid"],
            "email": decoded.get("email", ""),
        }
    except firebase_auth.ExpiredIdTokenError as e:
        print(f"Token expired: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token has expired: {str(e)}",
        )
    except firebase_auth.InvalidIdTokenError as e:
        print(f"Token invalid: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
        )
    except Exception as e:
        print(f"Token verification unexpected error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation error: {str(e)}",
        )
