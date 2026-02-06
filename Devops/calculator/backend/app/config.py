import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-change-in-production'
    WTF_CSRF_ENABLED = False  # Not using WTForms, mostly communicating via JSON API
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
