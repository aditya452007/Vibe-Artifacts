import json
import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables
load_dotenv()




# Configure Gemini
# API_KEY is now dynamic per request
DEFAULT_API_KEY = os.getenv("GEMINI_API_KEY")

SYSTEM_PROMPT = """
You are an elite legal risk auditor.
Your job is to protect a non-technical user from aggressive terms of service.

RULES:
1. NEVER summarize the document.
2. DETECT specific clauses that are:
    - HIGH RISK (Data selling, waivers, termination w/o notice, binding arbitration, tracking)
    - MODERATE RISK (Unclear terms, unilateral changes, limited liability)
    - LOW/GOOD (Privacy focus, clear opt-outs, refund policies)
3. GENERATE A VERDICT: "Accept" or "Refuse" based on the balance of these risks.
4. OUTPUT strictly valid JSON.
5. DO NOT explain legal concepts generally. Point to separate specific red flags.

JSON SCHEMA:
{
  "risk_breakdown": {
      "high": [{ "text": "Warning (max 10 words)", "category": "Privacy" | "Legal" | "Financial" }],
      "medium": [{ "text": "Warning (max 10 words)", "category": "Privacy" | "Legal" | "Financial" }],
      "low": [{ "text": "Positive/Neutral note (max 10 words)", "category": "good" }]
  },
  "action_verdict": "Accept" | "Refuse",
  "verdict_summary": "1-2 sentence plain english conclusion."
}
"""

def extract_text_from_url(url):
    """
    Scrapes text from a given URL to be analyzed.
    """
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer"]):
            script.decompose()
            
        # Get text
        text = soup.get_text(separator=' ', strip=True)
        
        # Truncate if too long (Gemini has limits, though high ones)
        return text[:30000] 
        
    except Exception as e:
        print(f"Scraping error: {e}")
        return None

def analyze_risk(text_input, api_key=None, provider='gemini'):
    """
    Analyzes the text for legal risks using the specified provider.
    """
    if not text_input or len(text_input) < 50:
        return {"error": "Text too short to analyze."}

    # Use provided key or fall back to env var (only for Server-Side default if needed, though user wants strict BYOK)
    # If provider is gemini and no key passed, try env.
    if not api_key and provider == 'gemini':
        api_key = DEFAULT_API_KEY

    if not api_key:
        return {"error": "API_KEY_MISSING", "message": f"Missing API Key for {provider}."}

    try:
        if provider == 'gemini':
            return _analyze_gemini(text_input, api_key)
        elif provider == 'openai':
            return _analyze_openai(text_input, api_key)
        elif provider == 'anthropic':
            return _analyze_anthropic(text_input, api_key)
        else:
            return {"error": "INVALID_PROVIDER", "message": f"Unknown provider: {provider}"}

    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "ResourceExhausted" in error_str or "rate_limit" in error_str:
            return {"error": "RATE_LIMIT", "message": "AI Service is currently overloaded. Please try again later."}
        
        print(f"{provider} API Error: {e}")
        return {"error": "AI_GENERATION_FAILED", "message": f"Analysis failed with {provider}: {str(e)}"}

def _analyze_gemini(text, key):
    import google.genai
    client = google.genai.Client(api_key=key)
    
    full_prompt = f"{SYSTEM_PROMPT}\n\nDOCUMENT TO ANALYZE:\n{text}"
    
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=full_prompt
    )
    return _parse_json(response.text)

def _analyze_openai(text, key):
    from openai import OpenAI
    client = OpenAI(api_key=key)
    
    response = client.chat.completions.create(
        model="gpt-5.2",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"DOCUMENT TO ANALYZE:\n{text}"}
        ],
        response_format={ "type": "json_object" }
    )
    return json.loads(response.choices[0].message.content)

def _analyze_anthropic(text, key):
    import anthropic
    client = anthropic.Anthropic(api_key=key)
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": f"DOCUMENT TO ANALYZE:\n{text}"}
        ]
    )
    return _parse_json(response.content[0].text)

def _parse_json(content):
    # Clean up JSON markdown block if present
    if content.startswith("```json"):
        content = content[7:-3]
    elif content.startswith("```"):
        content = content[3:-3]
    
    return json.loads(content)

def mock_audit(text):
    """
    Simulates AI analysis based on keywords.
    Fallback when API key is missing.
    """
    text = text.lower()
    risks = []
    
    if "sell" in text and "data" in text:
        risks.append({"text": "They explicitly state they can sell your data.", "category": "Privacy"})
    
    if "waive" in text:
        risks.append({"text": "You waive your right to legal action.", "category": "Legal"})
        
    if "terminate" in text:
        risks.append({"text": "Account can be deleted instantly.", "category": "Financial"})
        
    if "third party" in text or "affiliates" in text:
        risks.append({"text": "Data is shared with unidentified third parties.", "category": "Privacy"})

    # VERDICT LOGIC
    # Categorize for mock
    high = [r for r in risks if r['category'] in ['Privacy', 'Legal']]
    medium = [r for r in risks if r['category'] == 'Financial']
    
    verdict = "Refuse" if len(high) > 0 else "Accept"
    
    return {
        "risk_breakdown": {
            "high": high,
            "medium": medium,
            "low": [{"text": "HTTPS is enabled.", "category": "good"}]
        },
        "action_verdict": verdict,
        "verdict_summary": f"Mock Analysis: Found {len(high)} critical issues. Recommended to {verdict}."
    }
