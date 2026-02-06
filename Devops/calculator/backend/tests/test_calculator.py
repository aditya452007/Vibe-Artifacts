import pytest
from app.calculator import Calculator

def test_add():
    assert Calculator.calculate('add', 5, 3) == 8
    assert Calculator.calculate('add', -1, 1) == 0

def test_subtract():
    assert Calculator.calculate('subtract', 10, 4) == 6

def test_multiply():
    assert Calculator.calculate('multiply', 3, 4) == 12

def test_divide():
    assert Calculator.calculate('divide', 10, 2) == 5
    assert Calculator.calculate('divide', 5, 2) == 2.5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        Calculator.calculate('divide', 5, 0)

def test_sqrt():
    assert Calculator.calculate('sqrt', 9) == 3
    assert Calculator.calculate('sqrt', 0) == 0

def test_sqrt_negative():
    with pytest.raises(ValueError):
        Calculator.calculate('sqrt', -1)

def test_power():
    assert Calculator.calculate('power', 2, 3) == 8

def test_percentage():
    assert Calculator.calculate('percentage', 50, 100) == 50  # 50% of 100
    assert Calculator.calculate('percentage', 20, 50) == 10   # 20% of 50

def test_unknown_operation():
    with pytest.raises(ValueError):
        Calculator.calculate('unknown', 1, 1)

def test_missing_operand():
    with pytest.raises(ValueError):
        # Add requires 2 operands
        Calculator.calculate('add', 1) 
