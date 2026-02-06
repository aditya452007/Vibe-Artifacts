import multiprocessing
import os

bind = "0.0.0.0:5000"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
timeout = 30
keepalive = 2

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Environment variables
worker_class = "gthread"
reload = os.environ.get("FLASK_ENV") == "development"
