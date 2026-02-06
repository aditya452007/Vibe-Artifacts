FROM python:3.12-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run with Gunicorn production server
CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
