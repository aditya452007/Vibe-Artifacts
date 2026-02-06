import math

class Calculator:
    """Class to handle all calculator operations."""

    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def subtract(a, b):
        return a - b

    @staticmethod
    def multiply(a, b):
        return a * b

    @staticmethod
    def divide(a, b):
        if b == 0:
            raise ValueError("Division by zero is not allowed")
        return a / b

    @staticmethod
    def sqrt(a):
        if a < 0:
            raise ValueError("Cannot calculate square root of a negative number")
        return math.sqrt(a)

    @staticmethod
    def power(a, b):
        return math.pow(a, b)

    @staticmethod
    def percentage(a, b):
        return (a * b) / 100

    @staticmethod
    def calculate(operation, operand1, operand2=None):
        """
        Main entry point for calculations.
        Dispatches to the correct method based on operation string.
        """
        operations = {
            'add': Calculator.add,
            'subtract': Calculator.subtract,
            'multiply': Calculator.multiply,
            'divide': Calculator.divide,
            'sqrt': Calculator.sqrt,
            'power': Calculator.power,
            'percentage': Calculator.percentage
        }

        if operation not in operations:
            raise ValueError(f"Unknown operation: {operation}")

        func = operations[operation]
        
        # Handle operations that take 1 argument (like sqrt) vs 2 arguments
        if operation == 'sqrt':
            return func(operand1)
        else:
            if operand2 is None:
                 raise ValueError(f"Operation {operation} requires two operands")
            return func(operand1, operand2)
