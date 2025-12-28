from flask import Flask, send_from_directory, request, jsonify
import audit_engine
import time

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/api/audit', methods=['POST'])
def audit():
    data = request.json
    content_type = data.get('type', 'text') # 'text' or 'url'
    content = data.get('content', '')
    
    if not content:
        return jsonify({'error': 'No content provided'}), 400

    text_to_analyze = content
    
    # Handle Headers for Config
    api_key = request.headers.get('x-api-key')
    provider = request.headers.get('x-model-provider', 'gemini')

    # Handle URL
    if content_type == 'url':
        scraped_text = audit_engine.extract_text_from_url(content)
        if not scraped_text:
            return jsonify({'error': 'Failed to scrape URL. Content might be blocked or empty.'}), 400
        text_to_analyze = scraped_text

    # Artificial delay for Trust/Comfort feel (only if it's too fast)
    time.sleep(1.5) 

    result = audit_engine.analyze_risk(text_to_analyze, api_key=api_key, provider=provider)
    
    if "error" in result:
        # Map internal error codes to HTTP status
        status_code = 500
        if result["error"] == "API_KEY_MISSING":
            status_code = 503 # Service Unavailable
        elif result["error"] == "RATE_LIMIT":
            status_code = 429 # Too Many Requests
        elif result["error"] == "AI_GENERATION_FAILED":
            status_code = 502 # Bad Gateway
            
        return jsonify(result), status_code

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
