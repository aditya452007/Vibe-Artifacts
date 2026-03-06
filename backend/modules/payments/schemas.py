from pydantic import BaseModel
from datetime import datetime


class CreateOrderRequest(BaseModel):
    target_tier: str

    model_config = {"extra": "forbid"}


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str


class WebhookResponse(BaseModel):
    status: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    success: bool
    message: str
