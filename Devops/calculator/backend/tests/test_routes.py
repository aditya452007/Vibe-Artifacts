import json

def test_calculate_endpoint_success(client):
    response = client.post('/api/v1/calculate', json={
        "operation": "add",
        "operand1": 10,
        "operand2": 20
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["result"] == 30
    assert data["operation"] == "add"

def test_calculate_endpoint_error(client):
    response = client.post('/api/v1/calculate', json={
        "operation": "divide",
        "operand1": 10,
        "operand2": 0
    })
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "Division by zero" in data["error"]

def test_calculate_invalid_input(client):
    response = client.post('/api/v1/calculate', json={
        "operation": "add",
        "operand1": "invalid"
    })
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "must be valid numbers" in data["error"]

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
