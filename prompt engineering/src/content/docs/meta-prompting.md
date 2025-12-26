---
title: "Meta-Prompting"
description: "Using AI to architect AI systems."
order: 8
icon: "Cpu"
---

# Meta-Prompting

Meta-Prompting transforms the LLM from a worker into an **architect**. Instead of writing the prompt yourself, you ask the LLM to write the optimal prompt for a specific task.

## The Loop

1.  **Draft**: You give a high-level intent.
2.  **Generate**: The "Meta-LLM" writes a detailed system prompt.
3.  **Test**: You run the prompt on a test case.
4.  **Refine**: You ask the Meta-LLM to improve the prompt based on the failure.

## The Meta-Prompt Template

Use this to generate high-quality prompts:

```text
You are an expert Prompt Engineer.
Your goal is to write a prompt for GPT-4 that accomplishes the following task: [TASK DESCRIPTION].

The prompt should include:
- A clear Persona.
- Step-by-step instructions.
- Edge case handling.
- Examples (Few-Shot).

Output the prompt in a code block.
```

## Self-Correction (Reflexion)

A powerful meta-technique is asking the model to critique its own output *before* finalizing it.

> **Prompt**: "Draft an answer. Then, critique your draft for bias and accuracy. Finally, rewrite the answer based on the critique."

## Use Cases

*   **System Prompt Generation**: Creating the `system` message for a new chatbot.
*   **Data Synthesis**: Generating synthetic training data for fine-tuning.

> **Key Insight**: The best prompt engineers are often the models themselves. They know their own latent space better than you do.
