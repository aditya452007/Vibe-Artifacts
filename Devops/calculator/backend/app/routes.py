from flask import Blueprint, request, jsonify
from app.calculator import Calculator
import logging

bp = Blueprint('api', __name__, url_prefix='/api/v1')
logger = logging.getLogger(__name__)

@bp.route('/calculate', methods=['POST'])
def calculate():
    """
    Endpoint to perform calculations.
    Expected JSON:
    {
        "operation": "add",
        "operand1": 10,
        "operand2": 5
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    operation = data.get('operation')
    operand1 = data.get('operand1')
    operand2 = data.get('operand2')

    # Basic input validation
    if not operation:
        return jsonify({"error": "Missing 'operation' field"}), 400
    
    if operand1 is None:
        return jsonify({"error": "Missing 'operand1' field"}), 400
        
    # Validation for numbers
    try:
        operand1 = float(operand1)
        if operand2 is not None:
            operand2 = float(operand2)
    except (ValueError, TypeError):
        return jsonify({"error": "Operands must be valid numbers"}), 400

    try:
        result = Calculator.calculate(operation, operand1, operand2)
        return jsonify({
            "operation": operation,
            "result": result
        }), 200

    except ValueError as e:
        logger.warning(f"Calculation error: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
