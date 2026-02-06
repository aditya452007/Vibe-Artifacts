const API_BASE_URL = '/api/v1';

export const calculate = async (operation, operand1, operand2 = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation,
                operand1,
                operand2,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data.result;
    } catch (error) {
        throw error;
    }
};
