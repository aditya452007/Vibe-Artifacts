from flask import Flask
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend communication
    CORS(app)

    # Initialize Prometheus metrics
    # grouping_status=200 tells prometheus to group all 200 responses together 
    # and not create separate metrics for each unique path unless configured otherwise
    metrics = PrometheusMetrics(app, group_by='path')

    # Register Blueprints
    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app

# Create the application instance for Gunicorn
app = create_app()
